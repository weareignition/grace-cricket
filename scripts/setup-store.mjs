#!/usr/bin/env node
// Creates the store data the Grace theme expects: the product metafield
// definitions, the three bats, a Bats collection, the four template pages and
// the five menus (Grace-Cricket-Theme-Setup.md, sections 2 to 5).
//
// Usage:
//   npm run store:auth -- --store <store>.myshopify.com    once; opens a browser login
//   npm run store:setup -- --store <store>.myshopify.com [--dry-run]
//
// Safe to re-run:
// - Metafield definitions, products, the collection and pages are created only
//   when missing. Existing ones are left alone, except that a page's theme
//   template is corrected if it is wrong.
// - Menus are set to the links in store-data.mjs, replacing whatever links the
//   menu had. The old links are printed before they are replaced.
//
// The data (including placeholder product copy and prices) is in store-data.mjs.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { metafieldDefinitions, products, collection, pages, menus } from './store-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOPIFY = path.join(ROOT, 'node_modules', '.bin', 'shopify');
const NAMESPACE = 'custom';

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const store = readStoreArg(argv);

const log = (line = '') => console.log(line);
const heading = (title) => log(`\n${title}`);

function readStoreArg(args) {
  const eq = args.find((a) => a.startsWith('--store='));
  if (eq) return eq.slice('--store='.length);
  const i = args.indexOf('--store');
  if (i !== -1) return args[i + 1] || '';
  return process.env.SHOPIFY_FLAG_STORE || '';
}

if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(store)) {
  console.error('Usage: npm run store:setup -- --store <store>.myshopify.com [--dry-run]');
  process.exit(1);
}

// Runs an Admin GraphQL operation through Shopify CLI, using the token saved
// by `shopify store auth`. Returns the response's `data`.
// With --json the CLI writes one JSON object to stdout ({ data } or { error }),
// either pretty-printed or on one line, and progress events to stderr.
function gql(query, variables = {}, { mutation = false } = {}) {
  const args = ['store', 'execute', '--store', store, '--query', query, '--variables', JSON.stringify(variables), '--json', '--no-input'];
  if (mutation) args.push('--allow-mutations');
  let stdout;
  let failed = false;
  try {
    stdout = execFileSync(SHOPIFY, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024 });
  } catch (err) {
    stdout = String(err.stdout || '');
    failed = true;
  }

  const tryParse = (text) => {
    try {
      const obj = JSON.parse(text);
      return obj && typeof obj === 'object' && ('data' in obj || 'error' in obj) ? obj : null;
    } catch {
      return null;
    }
  };
  const result = tryParse(stdout.trim()) || stdout.split('\n').map(tryParse).find(Boolean);

  if (result && 'data' in result && !failed) return result.data;

  const message = result?.error?.message || stdout.trim() || 'no output';
  const steps = (result?.error?.nextSteps || []).map((s) => `\n  ${s}`).join('');
  throw new Error(`Shopify CLI: ${message}${steps}\n\nIf this is an authentication or scope error, run:\n  npm run store:auth -- --store ${store}`);
}

function check(payload, label) {
  const errors = payload?.userErrors || [];
  if (errors.length) {
    const detail = errors.map((e) => `${(e.field || []).join('.') || 'error'}: ${e.message}`).join('; ');
    throw new Error(`${label} failed. ${detail}`);
  }
  return payload;
}

function publish(id, publicationId, label) {
  const data = gql(
    `mutation($id: ID!, $publicationId: ID!) {
      publishablePublish(id: $id, input: { publicationId: $publicationId }) { userErrors { field message } }
    }`,
    { id, publicationId },
    { mutation: true },
  );
  check(data.publishablePublish, `Publishing ${label}`);
}

// Catches typos in store-data.mjs before anything is sent to the store.
function validateData() {
  const defs = new Map(metafieldDefinitions.map((d) => [d.key, d]));
  for (const product of products) {
    for (const [key, value] of Object.entries(product.metafields)) {
      const def = defs.get(key);
      if (!def) throw new Error(`${product.title}: custom.${key} has no definition in store-data.mjs`);
      if (def.choices) {
        const bad = [].concat(value).filter((v) => !def.choices.includes(v));
        if (bad.length) throw new Error(`${product.title}: custom.${key} has ${bad.join(', ')}; allowed values are ${def.choices.join(', ')}`);
      }
    }
  }
}

function toMetafields(values) {
  const types = new Map(metafieldDefinitions.map((d) => [d.key, d.type]));
  return Object.entries(values)
    .filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([key, v]) => ({
      namespace: NAMESPACE,
      key,
      type: types.get(key),
      value: Array.isArray(v) ? JSON.stringify(v) : String(v),
    }));
}

function setupDefinitions() {
  heading(`Product metafield definitions (${NAMESPACE} namespace)`);
  const data = gql(
    `query($namespace: String!) {
      metafieldDefinitions(first: 100, ownerType: PRODUCT, namespace: $namespace) { nodes { key type { name } } }
    }`,
    { namespace: NAMESPACE },
  );
  const existing = new Map(data.metafieldDefinitions.nodes.map((d) => [d.key, d.type.name]));
  const mismatched = [];

  for (const def of metafieldDefinitions) {
    const label = `${NAMESPACE}.${def.key}`;
    if (existing.has(def.key)) {
      const type = existing.get(def.key);
      if (type === def.type) {
        log(`  = ${label} exists`);
      } else {
        log(`  ! ${label} exists as ${type}, but the theme expects ${def.type}`);
        mismatched.push(label);
      }
      continue;
    }
    if (dryRun) {
      log(`  + would create ${label} (${def.type})`);
      continue;
    }
    const definition = {
      name: def.name,
      namespace: NAMESPACE,
      key: def.key,
      type: def.type,
      description: def.description,
      ownerType: 'PRODUCT',
      pin: true,
    };
    if (def.choices) definition.validations = [{ name: 'choices', value: JSON.stringify(def.choices) }];
    const res = gql(
      `mutation($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } }
      }`,
      { definition },
      { mutation: true },
    );
    check(res.metafieldDefinitionCreate, `Creating ${label}`);
    log(`  + ${label} created`);
  }

  if (mismatched.length) {
    throw new Error(`Fix the type of ${mismatched.join(', ')} in Settings, Custom data, Products, then re-run.`);
  }
}

function findOnlineStorePublication() {
  // The catalog title looks like "Channel Catalog 123 for Online Store"; `name`
  // is deprecated but kept as a fallback.
  const data = gql(`{ publications(first: 50) { nodes { id name catalog { title } } } }`);
  const pub = data.publications.nodes.find((p) => /(^|for )Online Store$/.test(p.catalog?.title || '') || p.name === 'Online Store');
  if (!pub) throw new Error('Could not find the Online Store sales channel on this store.');
  return pub.id;
}

function setupProducts(publicationId) {
  heading('Products');
  const ids = {};
  for (const p of products) {
    const found = gql(
      `query($handle: String!, $publicationId: ID!) {
        productByIdentifier(identifier: { handle: $handle }) { id status publishedOnPublication(publicationId: $publicationId) }
      }`,
      { handle: p.handle, publicationId },
    ).productByIdentifier;

    if (found) {
      ids[p.handle] = found.id;
      const note = found.publishedOnPublication ? '' : '. It is not published to the Online Store, so the theme will not show it';
      log(`  = ${p.title} exists (${found.status.toLowerCase()})${note}`);
      continue;
    }
    if (dryRun) {
      log(`  + would create ${p.title} at ${p.price} and publish it to the Online Store`);
      continue;
    }

    const input = {
      title: p.title,
      handle: p.handle,
      productType: p.productType,
      descriptionHtml: p.descriptionHtml,
      status: 'ACTIVE',
      productOptions: [{ name: 'Title', values: [{ name: 'Default Title' }] }],
      variants: [
        {
          optionValues: [{ optionName: 'Title', name: 'Default Title' }],
          price: p.price,
          inventoryItem: { tracked: false },
        },
      ],
      metafields: toMetafields(p.metafields),
    };
    const res = gql(
      `mutation($input: ProductSetInput!) {
        productSet(input: $input, synchronous: true) { product { id handle } userErrors { field message } }
      }`,
      { input },
      { mutation: true },
    );
    const product = check(res.productSet, `Creating ${p.title}`).product;
    publish(product.id, publicationId, p.title);
    ids[p.handle] = product.id;
    log(`  + ${p.title} created at ${p.price} and published to the Online Store`);
  }
  return ids;
}

function setupCollection(productIds, publicationId) {
  heading('Bats collection');
  const found = gql(
    `query($handle: String!) { collectionByIdentifier(identifier: { handle: $handle }) { id title } }`,
    { handle: collection.handle },
  ).collectionByIdentifier;

  if (found) {
    log(`  = ${found.title} exists`);
    return found.id;
  }
  if (dryRun) {
    log(`  + would create ${collection.title} (manual order: ${collection.products.join(', ')}) and publish it`);
    return null;
  }

  const res = gql(
    `mutation($input: CollectionInput!) { collectionCreate(input: $input) { collection { id } userErrors { field message } } }`,
    {
      input: {
        title: collection.title,
        handle: collection.handle,
        sortOrder: 'MANUAL',
        products: collection.products.map((h) => productIds[h]).filter(Boolean),
      },
    },
    { mutation: true },
  );
  const created = check(res.collectionCreate, `Creating ${collection.title}`).collection;
  publish(created.id, publicationId, collection.title);
  log(`  + ${collection.title} created and published to the Online Store`);
  return created.id;
}

function findPage(handle) {
  return gql(
    `query($q: String!) { pages(first: 5, query: $q) { nodes { id handle templateSuffix isPublished } } }`,
    { q: `handle:${handle}` },
  ).pages.nodes.find((n) => n.handle === handle);
}

function setupPages() {
  heading('Pages');
  const ids = {};
  for (const pg of pages) {
    const found = findPage(pg.handle);

    if (found) {
      ids[pg.handle] = found.id;
      if (found.templateSuffix === pg.templateSuffix) {
        log(`  = ${pg.title} exists with the ${pg.templateSuffix} template`);
      } else if (dryRun) {
        log(`  ~ would switch ${pg.title} to the ${pg.templateSuffix} template (currently ${found.templateSuffix || 'default'})`);
      } else {
        const res = gql(
          `mutation($id: ID!, $page: PageUpdateInput!) { pageUpdate(id: $id, page: $page) { page { id } userErrors { field message } } }`,
          { id: found.id, page: { templateSuffix: pg.templateSuffix } },
          { mutation: true },
        );
        check(res.pageUpdate, `Updating ${pg.title}`);
        log(`  ~ ${pg.title} switched to the ${pg.templateSuffix} template (was ${found.templateSuffix || 'default'})`);
      }
      if (!found.isPublished) log(`  ! ${pg.title} is hidden. Make it visible in Online Store, Pages.`);
      continue;
    }
    if (dryRun) {
      log(`  + would create ${pg.title} at /pages/${pg.handle} with the ${pg.templateSuffix} template`);
      continue;
    }

    const res = gql(
      `mutation($page: PageCreateInput!) { pageCreate(page: $page) { page { id handle } userErrors { field message } } }`,
      { page: { title: pg.title, handle: pg.handle, templateSuffix: pg.templateSuffix, isPublished: true, body: '' } },
      { mutation: true },
    );
    const page = check(res.pageCreate, `Creating ${pg.title}`).page;
    if (page.handle !== pg.handle) log(`  ! ${pg.title} got the handle ${page.handle} instead of ${pg.handle}. Buttons in the theme link to /pages/${pg.handle}.`);
    ids[pg.handle] = page.id;
    log(`  + ${pg.title} created at /pages/${page.handle} with the ${pg.templateSuffix} template`);
  }
  return ids;
}

function setupMenus({ collectionId, pageIds }) {
  heading('Menus');
  const existing = gql(`{ menus(first: 50) { nodes { id handle title items { title } } } }`).menus.nodes;
  const policies = gql(`{ shop { shopPolicies { id type body } } }`).shop.shopPolicies.filter((p) => p.body && p.body.trim());
  const notAdded = [];

  for (const menu of menus) {
    const items = [];
    for (const link of menu.items) {
      if (link.todo) {
        notAdded.push(`${menu.handle}: ${link.title} (${link.todo})`);
      } else if (link.page) {
        // Pages this script creates are in pageIds; others (such as contact) must already exist.
        const id = pageIds[link.page] || findPage(link.page)?.id;
        if (id || dryRun) items.push({ title: link.title, type: 'PAGE', resourceId: id });
        else notAdded.push(`${menu.handle}: ${link.title} (no page at /pages/${link.page})`);
      } else if (link.collection) {
        items.push({ title: link.title, type: 'COLLECTION', resourceId: collectionId });
      } else if (link.url) {
        items.push({ title: link.title, type: 'HTTP', url: link.url });
      } else if (link.policy) {
        const policy = policies.find((p) => p.type === link.policy);
        if (policy) items.push({ title: link.title, type: 'SHOP_POLICY', resourceId: policy.id });
        else notAdded.push(`${menu.handle}: ${link.title} (no ${link.policy.toLowerCase().replace(/_/g, ' ')} in Settings, Policies)`);
      }
    }

    const current = existing.find((m) => m.handle === menu.handle);
    const names = (list) => list.map((i) => i.title).join(', ') || 'no links';

    if (items.length === 0) {
      log(`  ! ${menu.handle}: none of its links have a destination yet, so it was left ${current ? 'as it is' : 'uncreated'}`);
      continue;
    }
    if (dryRun) {
      log(`  ${current ? '~ would replace' : '+ would create'} ${menu.handle}: ${names(items)}${current ? ` (currently ${names(current.items)})` : ''}`);
      continue;
    }

    if (current) {
      const res = gql(
        `mutation($id: ID!, $title: String!, $items: [MenuItemUpdateInput!]!) {
          menuUpdate(id: $id, title: $title, items: $items) { menu { id } userErrors { field message } }
        }`,
        { id: current.id, title: current.title, items },
        { mutation: true },
      );
      check(res.menuUpdate, `Updating ${menu.handle}`);
      log(`  ~ ${menu.handle}: ${names(items)} (replaced: ${names(current.items)})`);
    } else {
      const res = gql(
        `mutation($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
          menuCreate(title: $title, handle: $handle, items: $items) { menu { id handle } userErrors { field message } }
        }`,
        { title: menu.title, handle: menu.handle, items },
        { mutation: true },
      );
      const created = check(res.menuCreate, `Creating ${menu.handle}`).menu;
      if (created.handle !== menu.handle) log(`  ! ${menu.title} got the handle ${created.handle} instead of ${menu.handle}. Pick it in the theme editor.`);
      log(`  + ${created.handle}: ${names(items)}`);
    }
  }
  return notAdded;
}

function printRemaining(notAdded) {
  heading('Still to do by hand (setup notes, sections 7 and 8)');
  log('  - Settings, Customer accounts: turn on customer accounts, for the Pro Corner sign-in.');
  log('  - Customers: tag a test customer "pro" to check the Pro Corner booking form.');
  log('  - Online Store, Themes, Customise: hero film or image, player portraits, detail images.');
  if (notAdded.length) {
    log('  - Menu links not added because they have no destination yet:');
    for (const line of notAdded) log(`      ${line}`);
  }
  log('\nProduct prices and copy are placeholders. Edit them in Shopify admin, or in scripts/store-data.mjs for new stores.');
}

try {
  validateData();
  const { shop } = gql(`{ shop { name myshopifyDomain currencyCode } }`);
  log(`Store: ${shop.name} (${shop.myshopifyDomain}), prices in ${shop.currencyCode}${dryRun ? '\nDry run: nothing will be changed.' : ''}`);

  setupDefinitions();
  const publicationId = findOnlineStorePublication();
  const productIds = setupProducts(publicationId);
  const collectionId = setupCollection(productIds, publicationId);
  const pageIds = setupPages();
  const notAdded = setupMenus({ collectionId, pageIds });
  printRemaining(notAdded);
} catch (err) {
  console.error(`\n${err.message}`);
  process.exit(1);
}
