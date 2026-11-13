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

## Scripts

| Command | What it does |
|---|---|
| `npm run dev -- --store <store>` | Local preview with hot reload |
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
