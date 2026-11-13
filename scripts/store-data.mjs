// Store data used by scripts/setup-store.mjs.
// Mirrors sections 2 to 5 of Grace-Cricket-Theme-Setup.md.
//
// PLACEHOLDER CONTENT: prices, descriptions and the metafield copy below are
// stand-ins for previewing the theme on a dev store. The pick-up and
// sweet-spot scales follow the example values in the setup notes (section 6).
// Replace everything else with the client's copy before running this
// against a live store.

// Section 3: product metafield definitions (namespace "custom").
export const metafieldDefinitions = [
  { key: 'benefit_headline', name: 'Benefit headline', type: 'single_line_text_field', description: 'Product page headline; fit result line (fallback).' },
  { key: 'features', name: 'Features', type: 'list.single_line_text_field', description: 'Product page bullet list.' },
  { key: 'weight', name: 'Weight', type: 'single_line_text_field', description: 'Spec card, comparison, cards, fit result.' },
  { key: 'balance', name: 'Balance', type: 'single_line_text_field', description: 'Spec card.' },
  { key: 'sweet_spot', name: 'Sweet spot', type: 'single_line_text_field', description: 'Spec card, fit result.' },
  { key: 'handle', name: 'Handle', type: 'single_line_text_field', description: 'Spec card, comparison.' },
  { key: 'willow', name: 'Willow', type: 'single_line_text_field', description: 'Spec card, comparison, fit result.' },
  { key: 'knocking_in', name: 'Knocking-in', type: 'single_line_text_field', description: 'Spec card.' },
  { key: 'pickup_scale', name: 'Pick-up scale', type: 'list.single_line_text_field', description: 'Comparison bars, fit quiz matching. Pick one or two.', choices: ['Light', 'Balanced', 'Heavy'] },
  { key: 'sweet_spot_scale', name: 'Sweet spot scale', type: 'list.single_line_text_field', description: 'Comparison bars, cards, fit quiz matching. Pick one or two.', choices: ['Low', 'Mid', 'High'] },
  { key: 'fit_summary', name: 'Fit summary', type: 'single_line_text_field', description: 'Optional. The "why this bat" line on the fit result.' },
];

// Section 2: the three bats. Listed in fit-quiz tie-break order: the default
// recommendation (The Gracer) comes first.
export const products = [
  {
    handle: 'the-gracer',
    title: 'The Gracer',
    productType: "Players' bat",
    price: '349.00',
    descriptionHtml: "<p>Our all-round players' bat. Light in the hands, with a generous middle, and knocked in before it leaves the workshop.</p>",
    metafields: {
      benefit_headline: 'More energy into every ball.',
      features: ['Plays lighter than the scale weight', 'A bigger middle for drives and pulls', 'Knocked in and ready to play'],
      weight: '2lb 9oz',
      balance: 'Plays lighter than the scale',
      sweet_spot: 'Mid, bigger middle',
      handle: "Pete's signature shape",
      willow: 'Hand-selected English',
      knocking_in: 'Done, ready to play',
      pickup_scale: ['Light', 'Balanced'],
      sweet_spot_scale: ['Mid'],
      fit_summary: 'Light and balanced, with a mid middle that suits most games.',
    },
  },
  {
    handle: 'tour-edition',
    title: 'Tour Edition',
    productType: "Players' bat",
    price: '399.00',
    descriptionHtml: '<p>The lightest bat in the range, with a lower middle. Built for players who score through timing and placement.</p>',
    metafields: {
      benefit_headline: 'Timing and control, ball after ball.',
      features: ['The lightest pick-up in the range', 'A lower middle for front-foot timing', 'Knocked in and ready to play'],
      weight: '2lb 7oz',
      balance: 'Light, quick in the hands',
      sweet_spot: 'Low',
      handle: "Pete's signature shape",
      willow: 'Hand-selected English',
      knocking_in: 'Done, ready to play',
      pickup_scale: ['Light'],
      sweet_spot_scale: ['Low'],
      fit_summary: 'Lighter, with a lower middle, built for timing and control.',
    },
  },
  {
    handle: 'grace-full',
    title: 'Grace Full',
    productType: "Players' bat",
    price: '449.00',
    descriptionHtml: '<p>A fuller profile with more weight behind the ball and a higher middle, for players who like to hit through the line.</p>',
    metafields: {
      benefit_headline: 'More weight behind every shot.',
      features: ['A fuller profile with thick edges', 'A higher middle for back-foot play and bounce', 'Knocked in and ready to play'],
      weight: '2lb 11oz',
      balance: 'Balanced to bottom-heavy',
      sweet_spot: 'Mid to high',
      handle: "Pete's signature shape",
      willow: 'Hand-selected English',
      knocking_in: 'Done, ready to play',
      pickup_scale: ['Balanced', 'Heavy'],
      sweet_spot_scale: ['Mid', 'High'],
      fit_summary: 'More weight and a higher middle, built for power.',
    },
  },
];

// A manual-order "Bats" collection, so the Bats menu links have a destination
// and the range, comparison and fit sections can be pointed at it later
// (setup notes, section 8).
export const collection = {
  handle: 'bats',
  title: 'Bats',
  products: ['the-gracer', 'tour-edition', 'grace-full'],
};

// Section 5: pages and their theme templates.
export const pages = [
  { title: 'Find your fit', handle: 'find-your-fit', templateSuffix: 'find-your-fit' },
  { title: 'The Method', handle: 'the-method', templateSuffix: 'method' },
  { title: 'Players', handle: 'players', templateSuffix: 'players' },
  { title: 'Pro Corner', handle: 'pro-corner', templateSuffix: 'pro-corner' },
];

// Section 4: menus. Each link targets one of:
//   page: <page handle>, collection: <collection handle>, url: <path>,
//   policy: <ShopPolicyType>  (added only if the store has that policy)
// Links marked `todo` have no destination in the store yet. They are
// reported, not created.
export const menus = [
  {
    handle: 'main-menu',
    title: 'Main menu',
    items: [
      { title: 'Bats', collection: 'bats' },
      { title: 'Find your fit', page: 'find-your-fit' },
      { title: 'The Method', page: 'the-method' },
      { title: 'Players', page: 'players' },
      { title: 'Pro Corner', page: 'pro-corner' },
    ],
  },
  {
    handle: 'footer-shop',
    title: 'Footer: Shop',
    items: [
      { title: 'The bats', collection: 'bats' },
      { title: 'Gloves & grips', todo: 'no gloves or grips collection yet' },
      { title: 'Find your fit', page: 'find-your-fit' },
      { title: 'Gift cards', todo: 'no gift card product yet' },
    ],
  },
  {
    handle: 'footer-brand',
    title: 'Footer: Brand',
    items: [
      { title: 'The Method', page: 'the-method' },
      { title: 'Players', page: 'players' },
      { title: 'Pro Corner', page: 'pro-corner' },
      { title: 'About', todo: 'no About page yet' },
    ],
  },
  {
    handle: 'footer-account',
    title: 'Footer: Account',
    items: [
      { title: 'Log in', url: '/account/login' },
      { title: 'My stats', todo: 'player stats are phase two' },
      { title: 'Community', todo: 'no community page yet' },
      { title: 'Support', page: 'contact' },
    ],
  },
  {
    handle: 'footer',
    title: 'Footer menu',
    items: [
      { title: 'Instagram', todo: 'Instagram URL not supplied' },
      { title: 'Shipping', policy: 'SHIPPING_POLICY' },
      { title: 'Terms', policy: 'TERMS_OF_SERVICE' },
    ],
  },
];
