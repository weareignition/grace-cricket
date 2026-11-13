# Grace Cricket Shopify theme

Shopify theme for Grace Cricket, built on Dawn 16.1.1 (MIT) with Grace sections added on top.

Store setup (products, metafields, menus, pages, Pro Corner access) is documented in [Grace-Cricket-Theme-Setup.md](Grace-Cricket-Theme-Setup.md).

## Requirements

- Node.js 22.12 or later (required by Shopify CLI 5)
- Access to the Shopify store as staff or collaborator

Shopify CLI is a dev dependency, so there is nothing to install globally.

```sh
npm install
```

## Local development

Run the theme against your store with hot reload. The first run opens a browser to log in to Shopify.

```sh
npm run dev -- --store your-store.myshopify.com
```

The preview runs at http://127.0.0.1:9292. It uses a temporary development theme on the store, so the live theme is not affected.

## Store setup

The theme needs product metafield definitions, the three bats, four pages with their templates, and five menus. `scripts/setup-store.mjs` creates them through the Admin API, following sections 2 to 5 of the setup notes.

```sh
npm run store:auth -- --store your-store.myshopify.com              # once: browser login, grants the scopes the script needs
npm run store:setup -- --store your-store.myshopify.com --dry-run   # show what would change
npm run store:setup -- --store your-store.myshopify.com             # apply
```

Use the store's permanent `.myshopify.com` address (for the dev store, `grace-cricket-7ri0412g.myshopify.com`). The login rejects an alias such as `grace-cricket.myshopify.com` and names the permanent address.

It is safe to re-run. Definitions, products, the Bats collection and pages are only created when missing. A page's theme template is corrected if it is wrong. Menus are set to the links in `scripts/store-data.mjs`, and the old links are printed before they are replaced.

Product prices and copy in `scripts/store-data.mjs` are placeholders for previewing on a dev store. Customer accounts, the `pro` customer tag and theme editor images are still set by hand (setup notes, sections 7 and 8).

## Testing from outside New Zealand

The store sells to one market, New Zealand. From anywhere else, Add to bag fails with "The product is already sold out" even though the product page shows it in stock. To test the cart, pick **New Zealand** in the theme editor's context menu (next to the theme name), add to cart, then switch back to Store default and undo, so no New Zealand customisation is saved.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev -- --store <store>` | Local preview with hot reload |
| `npm run store:auth -- --store <store>` | Log in for the store setup script |
| `npm run store:setup -- --store <store>` | Create the store data the theme needs |
| `npm run check` | Shopify theme check (lint) |
| `npm run list -- --store <store>` | List the themes on the store |
| `npm run pull -- --store <store> --theme <id>` | Pull a theme from the store, for example editor changes to `config/settings_data.json` or `templates/*.json` |
| `npm run push -- --store <store>` | Upload this code as a new unpublished theme |

## Layout

Standard Shopify theme structure at the repo root (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`), so the repo can be connected with Shopify's GitHub integration (Online Store, Themes, Add theme, Connect from GitHub).

Grace-specific files:

- `assets/grace.css`, `assets/grace.js`, `assets/grace-*.woff2`
- `snippets/grace-*.liquid`
- `sections/grace-*.liquid`
- `templates/page.method.json`, `page.players.json`, `page.find-your-fit.json`, `page.pro-corner.json`

Content edited in the theme editor is saved to `config/settings_data.json` and the `templates/*.json` files. Pull those changes before editing the same files locally, or they will be overwritten on the next push.
