/**
 * The product catalogue.
 *
 * `icon` / `banner` are Google Play CDN URLs and are safe to hotlink.
 * To fill in a missing one: open the app on Play, right-click the icon ->
 * "Copy image address", and paste it here. Or add the `packageId` and run
 * `npm run fetch:assets`, which scrapes both automatically.
 *
 * `status`: 'live' | 'beta'
 */
export const apps = [
  {
    slug: 'stylesnap',
    name: 'StyleSnap: AI Personal Stylist',
    short: 'StyleSnap',
    category: 'AI Tools',
    status: 'live',
    packageId: 'com.stylesnapai.app',
    tagline: 'Snap an outfit and get a style score, colour palette and stylist-grade tips in seconds.',
    description:
      'Trained on South Asian and contemporary Western aesthetics, StyleSnap runs a lightweight vision model on-device to read fabric texture, silhouette balance and seasonal palette harmony — then returns an editorial-quality readout with no account and no social feed.',
    features: [
      { title: 'On-device vision model', body: 'Runs locally with zero latency or cloud leaks.' },
      { title: '0.4s inference time', body: 'Deterministic output via quantised weights.' },
      { title: 'Urdu & English tips', body: 'Culturally nuanced bilingual fashion advice.' },
      { title: 'Export to socials', body: 'High-res cards for Pinterest and Instagram.' },
    ],
    metrics: [
      { k: 'Category', v: 'Lifestyle' },
      { k: 'Installs', v: '50+' },
    ],
    accent: '#8B5CF6',
    icon: '/apps/stylesnap-icon.png',
    banner: '/apps/stylesnap-banner.jpg',
    screenshots: [
      'https://play-lh.googleusercontent.com/NYOmyl6fFyo2W-3pfO3z2xfCNOB9wS1Pr4rKbwv3xdNaWQCJ63bHgMPturVlOqtrWV_jTgSoXhMEi_YThPzKJg=w640-h360',
      'https://play-lh.googleusercontent.com/COCgpmvxJg_yt84ri8_5BAzOUamLl8w5Zt_SC35bgxlzKaaU3qLFcsg-NOuZzOPgu2Ru16aW8fWdi3_GO8yS=w640-h360',
      'https://play-lh.googleusercontent.com/pv_kEgtMwNZKfpAid1_DMQfmaA0rxjSv-S3JT9VIz6KfQO3v354Hz0tlcfAFSMZYOozt-GZoXI4mdlMZM-En=w640-h360',
      'https://play-lh.googleusercontent.com/rC2e4Daz6hTk_XfnrTm2bw_rtU9zzvzScRqvOxQKWaOc_2NANXYEy03435z6pkEg_rcV_nGpKThauxn6Bgbq=w640-h360',
    ],
    featured: true,
  },
  {
    slug: 'finsnap',
    name: 'FinSnap Ai: Receipt Scanner',
    short: 'FinSnap Ai',
    category: 'Finance',
    status: 'live',
    packageId: '',
    tagline: 'Scan any receipt and let AI track, categorise and summarise your spending automatically.',
    description:
      'Point the camera at a receipt and FinSnap extracts line items with OCR, classifies each one, and rolls everything into a live balance with category breakdowns and weekly insights.',
    features: [
      { title: 'Instant OCR', body: 'Line-item extraction from crumpled paper.' },
      { title: 'Auto categories', body: 'Groceries, dining, transport, shopping.' },
      { title: 'Spending insights', body: 'Weekly AI summary of where money went.' },
      { title: 'Offline vault', body: 'Receipts stay encrypted on your device.' },
    ],
    metrics: [{ k: 'Category', v: 'Finance' }],
    accent: '#14B8A6',
    icon: '/apps/finsnap-icon.png',
    banner: '/apps/finsnap-banner.jpg',
    screenshots: [],
    featured: true,
  },
  {
    slug: 'ruya-ai',
    name: 'Ruya AI: Khwab ki Tabeer',
    short: 'Ruya AI',
    category: 'Islamic',
    status: 'live',
    packageId: '',
    tagline: 'AI dream interpretation inspired by Ibn Sirin, in Urdu, Roman Urdu and English.',
    description:
      'Describe a dream in your own words and Ruya AI returns an interpretation grounded in classical Islamic dream literature, with the symbolism explained rather than just asserted.',
    features: [
      { title: 'Ibn Sirin grounded', body: 'Answers cite classical symbolism.' },
      { title: 'Three languages', body: 'Urdu, Roman Urdu and English.' },
      { title: 'Private journal', body: 'Dream history saved on-device.' },
      { title: 'Respectful tone', body: 'No fortune-telling, no fear-mongering.' },
    ],
    metrics: [{ k: 'Category', v: 'Lifestyle' }],
    accent: '#D4A537',
    icon: '/apps/ruya-ai-icon.png',
    banner: '/apps/ruya-ai-banner.jpg',
    screenshots: [],
    featured: true,
  },
  {
    slug: 'zakat-calculator-pk',
    name: 'Zakat Calculator PK 2026',
    short: 'Zakat Calc 2026',
    category: 'Islamic',
    status: 'beta',
    packageId: '',
    tagline: 'Calculate Zakat, Ushr, Fidyah, Kaffarah and Qurbani with live gold and silver rates.',
    description:
      'A complete Pakistani Zakat toolkit — nisab thresholds computed against live gold and silver rates, with separate calculators for Ushr, Fidyah, Kaffarah and Qurbani shares.',
    features: [
      { title: 'Live metal rates', body: 'Nisab recalculated against today’s rates.' },
      { title: 'Five calculators', body: 'Zakat, Ushr, Fidyah, Kaffarah, Qurbani.' },
      { title: 'PKR native', body: 'Built around Pakistani rates and practice.' },
      { title: 'Save & share', body: 'Export a breakdown for your records.' },
    ],
    metrics: [{ k: 'Category', v: 'Finance' }],
    accent: '#C9A227',
    icon: '/apps/zakat-calculator-pk-icon.png',
    banner: '/apps/zakat-calculator-pk-banner.jpg',
    screenshots: [],
    featured: false,
  },
  {
    slug: 'paisaly',
    name: 'Paisaly: Earn Real Money',
    short: 'Paisaly',
    category: 'Finance',
    status: 'live',
    packageId: '',
    tagline: 'Complete tasks, refer friends and withdraw earnings to EasyPaisa or JazzCash.',
    description:
      'A rewards app built for Pakistan: finish short tasks, build a referral tree, and cash out straight into EasyPaisa or JazzCash with fast, verified withdrawals.',
    features: [
      { title: 'Local payouts', body: 'EasyPaisa and JazzCash withdrawals.' },
      { title: 'Refer & earn', body: 'Invite friends and earn on their activity.' },
      { title: 'Daily tasks', body: 'Fresh task board every morning.' },
      { title: 'Transparent ledger', body: 'Every rupee traced in your history.' },
    ],
    metrics: [{ k: 'Category', v: 'Finance' }],
    accent: '#10B981',
    icon: '/apps/paisaly-icon.png',
    banner: '/apps/paisaly-banner.jpg',
    screenshots: [],
    featured: false,
  },
  {
    slug: 'termuxpert',
    name: 'TermuXpert',
    short: 'TermuXpert',
    category: 'Education',
    status: 'live',
    packageId: 'io.termuxpert.app',
    tagline: 'A complete Termux and Linux command handbook with an ethical hacking learning toolkit.',
    description:
      'Every Termux command organised into categories with examples, plus a documented ethical-hacking tool reference covering purpose, install steps and responsible usage. Built for students and security learners.',
    features: [
      { title: 'Searchable library', body: 'Every command with a copy button.' },
      { title: 'Termux-API guide', body: 'Toast, dialog, clipboard, notifications.' },
      { title: 'Tool reference', body: 'Install steps and safe-usage notes.' },
      { title: 'Works offline', body: 'The whole handbook ships in the app.' },
    ],
    metrics: [
      { k: 'Category', v: 'Education' },
      { k: 'Installs', v: '1K+' },
    ],
    accent: '#3B82F6',
    icon: '/apps/termuxpert-icon.png',
    banner: '/apps/termuxpert-banner.jpg',
    screenshots: [
      'https://play-lh.googleusercontent.com/C2mCsxjWiUEUtUcg0cQT7mqbwCprsyJIc6C5swvzXc7RvmTQfN6wTW7b_cnAtjC1HpyFZ6m-YdEkHBClRquSOQ=w640-h360',
      'https://play-lh.googleusercontent.com/jrODlJAoohjv79ydCtwi93ZIq5An9qPZNMyIIc0CDjQMIwSTRvgWw1kHDn13sJI7lJZqOW9uxPxJm1TgTj372g=w640-h360',
      'https://play-lh.googleusercontent.com/BApn0YzvE3k8P2NTHeEoxg5a-AJ1PZQHhzEAH7b90AuCF1Sp6LbMhVtOxFNLhmEDg7sAdGgKT0K6xycDO7DRLQ=w640-h360',
    ],
    featured: false,
  },
  {
    slug: 'statica',
    name: 'Statica: Status Saver Download',
    short: 'Statica',
    category: 'Utilities',
    status: 'beta',
    packageId: '',
    tagline: 'Preview and save WhatsApp statuses in a single tap.',
    description:
      'Browse every status your contacts posted today in a clean grid, preview in full screen, and save photos or videos to your gallery with one tap. No clutter, no ads between taps.',
    features: [
      { title: 'One-tap save', body: 'Photos and videos straight to gallery.' },
      { title: 'Full-screen preview', body: 'Check before you download.' },
      { title: 'Repost ready', body: 'Share saved statuses anywhere.' },
      { title: 'Tiny footprint', body: 'Fast on low-end devices.' },
    ],
    metrics: [{ k: 'Category', v: 'Tools' }],
    accent: '#06B6D4',
    icon: '/apps/statica-icon.png',
    banner: '/apps/statica-banner.jpg',
    screenshots: [],
    featured: false,
  },
  {
    slug: 'mergemint',
    name: 'MergeMint - Coin Merge Puzzle',
    short: 'MergeMint',
    category: 'Games',
    status: 'live',
    packageId: 'com.technicalcorp.mergemint',
    tagline: 'Relaxing coin-merge puzzle with 50+ levels, daily rewards and boosters.',
    description:
      'Drag identical coins together to merge them into bigger ones across 50+ hand-crafted levels, with daily streak rewards, four boosters, cloud save and full offline play.',
    features: [
      { title: '50+ levels', body: 'Hand-crafted merge puzzles.' },
      { title: 'Daily streaks', body: 'Rewards that grow to a day-7 bonus.' },
      { title: 'Four boosters', body: 'Shuffle, undo, extra moves, double score.' },
      { title: 'Plays offline', body: 'Cloud save syncs when you reconnect.' },
    ],
    metrics: [{ k: 'Category', v: 'Puzzle' }],
    accent: '#F59E0B',
    icon: '/apps/mergemint-icon.png',
    banner: '/apps/mergemint-banner.jpg',
    screenshots: [
      'https://play-lh.googleusercontent.com/Ha5BSrh8OSNFQp40GHVScXtx0OjUQOH3zSgWKPTQeFBF6uTT1g3_C1FBf91CVJbLVkpz0khFx4h9Vv9TFGWy=w640-h360',
      'https://play-lh.googleusercontent.com/twt3SeHSGOHbCh8T2i0EIasCyu6IMKSMJuR9m7ye9ZG0ouunozoEc-ZRoFKmuVXbdX2o9oi-Rk-SBQzxCykLCg=w640-h360',
    ],
    featured: false,
  },
]

export const appCategories = ['All', 'AI Tools', 'Finance', 'Islamic', 'Education', 'Utilities', 'Games']

export const playUrl = (app) =>
  app.packageId ? `https://play.google.com/store/apps/details?id=${app.packageId}` : null

export const featuredApps = apps.filter((a) => a.featured)
