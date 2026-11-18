# Grace Cricket Shopify theme: setup notes (v0.2)

Theme file: `Grace-Cricket-Theme-v0.2.zip` (replaces v0.1)
Base: Shopify Dawn 16.1.1 (MIT licence), with Grace sections added on top.

## What is in this build

| Area | Status |
|---|---|
| Header, announcement bar, footer | Built (Grace design, replaces Dawn's) |
| Homepage | Built: hero, player carousel, bat range, method, comparison, feature list, community film, newsletter |
| Product page | Built: gallery and buy box, feature list, specifications, comparison, range, player carousel, dual panels |
| The Method | Built (page template `method`) |
| Players | Built (page template `players`) |
| Find your fit | Built (page template `find-your-fit`): working quiz that matches a real product |
| Pro Corner | Built (page template `pro-corner`): access gated by customer tag |
| Cart, search, collections, blog, account, 404 | Dawn's own templates, picking up Grace fonts and colours |
| Player stats, bat journal, video library | Not built. Stats is phase two; journal and videos can use Dawn's blog and page templates at launch |

## 1. Upload

1. Shopify admin: Online Store, Themes, Add theme, Upload zip file.
2. Keep it unpublished and use Preview until content is loaded.

## 2. Products

Create the three bats: The Gracer, Tour Edition, Grace Full.

- **Product type** is shown as the eyebrow above the title and on cards (the design uses "Players' bat").
- **Description** is the intro paragraph on the product page.
- **Media**: product images first, then an optional video. A video shows in the gallery as the "Film" thumbnail.
- Shoot bats on white or transparent backgrounds. The theme blends white backgrounds into the tonal panels.

## 3. Product metafields (required for specs, comparison, cards and the fit quiz)

Settings, Custom data, Products, Add definition. Use the namespace and key exactly as written.

| Namespace and key | Type | Example | Used in |
|---|---|---|---|
| `custom.benefit_headline` | Single line text | More energy into every ball. | Product page headline; fit result line (fallback) |
| `custom.features` | Single line text (list) | Plays lighter than the scale weight | Product page bullet list |
| `custom.weight` | Single line text | 2lb 9oz | Spec card, comparison, cards, fit result |
| `custom.balance` | Single line text | Plays lighter than the scale | Spec card |
| `custom.sweet_spot` | Single line text | Mid, bigger middle | Spec card, fit result |
| `custom.handle` | Single line text | Pete's signature shape | Spec card, comparison |
| `custom.willow` | Single line text | Hand-selected English | Spec card, comparison, fit result |
| `custom.knocking_in` | Single line text | Done, ready to play | Spec card |
| `custom.pickup_scale` | Single line text (list) | Light, Balanced | Comparison bars, fit quiz matching |
| `custom.sweet_spot_scale` | Single line text (list) | Mid | Comparison bars, cards, fit quiz matching |
| `custom.fit_summary` (optional) | Single line text | Lighter, with a lower middle, built for timing and control. | The "why this bat" line on the fit result |

Allowed values for the two scales:

- `custom.pickup_scale`: Light, Balanced, Heavy (pick one or two)
- `custom.sweet_spot_scale`: Low, Mid, High (pick one or two)

A spec row is hidden when its metafield is empty, so nothing breaks if a value is missing.

## 4. Menus

Online Store, Navigation. The theme looks for these handles:

| Handle | Where it shows | Suggested links |
|---|---|---|
| `main-menu` | Header | Bats, Find your fit, The Method, Players, Pro Corner |
| `footer-shop` | Footer column 1 | The bats, Gloves & grips, Find your fit, Gift cards |
| `footer-brand` | Footer column 2 | The Method, Players, Pro Corner, About |
| `footer-account` | Footer column 3 | Log in, My stats, Community, Support |
| `footer` | Footer bottom line | Search, Instagram, Shipping, Terms |

Menus can be swapped in the theme editor if different handles are used.

## 5. Pages

Create four pages and assign each its template (Online Store, Pages, open the page, Theme template). The handles matter because buttons across the site point at them.

| Page title | Handle (URL) | Theme template |
|---|---|---|
| Find your fit | `/pages/find-your-fit` | `find-your-fit` |
| The Method | `/pages/the-method` | `method` |
| Players | `/pages/players` | `players` |
| Pro Corner | `/pages/pro-corner` | `pro-corner` |

The page body can stay empty. All content is in the template sections and is edited in the theme editor.

The Bats collection uses the `bats` template (Products, Collections, Bats, Theme template): Grace bat cards in the collection's order, then the comparison and a link to the quiz.

## 6. Find your fit: how the match works

The quiz has four questions. The match is scored from the same metafields as the comparison tool, so there is nothing separate to maintain.

| Answer | Effect |
|---|---|
| Question 1 (your game) | No effect on the match. It sets the scene only. |
| Pick-up: Light, Balanced, A bit of weight | 2 points to each bat whose `custom.pickup_scale` includes Light, Balanced or Heavy respectively |
| Middle: Low, Mid, High | 2 points to each bat whose `custom.sweet_spot_scale` includes that value |
| Priority: Power | 1 point for Heavy pick-up, 1 point for High middle |
| Priority: Control | 1 point for Light pick-up, 1 point for Low middle |
| Priority: All-round | 1 point for Balanced pick-up, 1 point for Mid middle |

The highest score wins. A tie goes to the bat listed first, so order the products (or the chosen collection) with the default recommendation first. The result shows the bat, its specs, price, Add to bag and a link to the product.

With the example values (Gracer: Light and Balanced, Mid; Tour: Light, Low; Full: Balanced and Heavy, Mid and High), a light, low, control player gets the Tour Edition; heavy, high, power gets the Grace Full; balanced, mid, all-round gets The Gracer.

## 7. Pro Corner: how access works

1. Turn on customer accounts (Settings, Customer accounts).
2. A visitor without access sees the "Request access" form. It is sent to the store's contact email (Settings, Notifications, sender email), marked "Pro Corner access request".
3. To approve someone, open or create their customer record in Shopify and add the tag `pro`.
4. When that customer signs in and opens Pro Corner, they see the "Book a repair with Pete" form instead. It is also sent to the store's contact email, marked "Pro Corner repair booking", with their name and email attached.

Things to know:

- The tag name can be changed in the section settings.
- A signed-in customer without the tag is told they do not have access yet and can send a request.
- The sign-in button goes to Shopify's hosted customer login (an emailed code, no password field on the page). After signing in, the customer needs to return to the Pro Corner page.
- This hides the booking form from people without the tag. It is access control for a form, which is all that is needed here; it is not a secure document store.

## 8. Theme editor content

Online Store, Themes, Customise.

- **Hero**: upload the looping film, or a banner image. With neither, the blue gradient shows.
- **Player carousel and player wall**: add a portrait to each Player block. Caption by level, not by name, and only use images the client has cleared. Never present a player as using a Grace bat.
- **Bat range, comparison and fit quiz**: these use all products by default. Once grips and gloves exist, choose the three bats explicitly or pick a "Bats" collection in each section.
- **Feature lists and editorial sections**: add the detail images. On the product page the feature image falls back to the product's main image.
- **Community and dark panels**: upload a film or an image if wanted. The gradients stand on their own without one.
- **Per-product copy**: the feature list text on the product template is shared by all bats. To vary it per bat, connect the text fields to product metafields using the dynamic source icon in the editor.

## 9. Behaviour to know about

- **Add to bag** posts to the cart page (Dawn's cart). There is no slide-out cart drawer in this build.
- **Variants** show as a single dropdown. If bats have more than one option (for example handle and weight), each combination is one entry.
- **Newsletter** creates a customer tagged `newsletter`.
- **Fonts** (Archivo, Inter, IBM Plex Mono) are bundled in the theme under the SIL Open Font Licence. No external font requests.

## 10. How this build was checked

- Shopify theme check: 0 errors. 9 warnings, all in unmodified Dawn files.
- Every template rendered through a local test harness with mock products, at 1440px and 390px, for an empty store and a populated store. No script errors and no horizontal overflow.
- Interactions tested: comparison dropdowns, product gallery, variant price, mobile menu, the fit quiz (three answer paths, back, start over, add to bag wiring) and the three Pro Corner states (visitor, signed in without the tag, signed in with the tag).
- **Not yet done**: a run on a real Shopify store. The harness approximates Shopify's Liquid, so the first upload to a development store is the real test. Check in this order:
  1. The theme uploads without errors and every template opens in the editor.
  2. Add to bag from the product page and from the fit result.
  3. Newsletter signup and both Pro Corner forms arrive in the store's inbox.
  4. Tag a test customer `pro`, sign in, and confirm the booking form appears.
  5. Hero film playback and the mobile menu on a phone.

## 11. Files added to Dawn

- `assets/grace.css`, `assets/grace.js`, four `assets/grace-*.woff2` font files
- `snippets/grace-fonts.liquid`, `grace-bat.liquid`, `grace-scale.liquid`, `grace-product-card.liquid`
- `sections/grace-*.liquid` (21 sections)
- `templates/page.method.json`, `page.players.json`, `page.find-your-fit.json`, `page.pro-corner.json`
- Replaced: `templates/index.json`, `templates/product.json`, `sections/header-group.json`, `sections/footer-group.json`
- Edited: `layout/theme.liquid` (three lines loading Grace assets), `config/settings_data.json` (brand colours, cart as page), `config/settings_schema.json` (theme name)
