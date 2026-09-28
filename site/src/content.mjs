// All copy for the Tuskrr site. Product names, inspirations, stories and
// campaign lines are Tuskrr's own words (Tuskrr Product Names copy.pdf, as
// cleaned up in the brand world). The tagline, voice, gift notes and proof
// points come from the brand world, The Entrance (brand-world/src/worlds.mjs).

export const TAGLINE = 'Arrive like you mean it.';

// glow: the colour behind each bag, read off the product photos.
// fits: SAMPLE laptop sizes from the brand world, labelled as samples on the page.
export const PRODUCTS = [
  {
    id: 'ridge', name: 'Ridge', inspired: 'terrain', type: 'Backpack', finish: 'Cognac leather', glow: '#C27442',
    fits: '15.6-inch laptop',
    story: 'The ridges of a mountain never run perfectly straight. They rise, fall and adapt to the terrain. RIDGE turns that movement into leather: structure for something designed to move.',
    line: 'Carry your own direction.',
    alt: 'RIDGE, a cognac leather backpack with vertical stitched channels',
  },
  {
    id: 'traverse', name: 'Traverse', inspired: 'movement', type: 'Weekender', finish: 'Cognac leather, frame top', glow: '#D39A6A',
    fits: '16-inch laptop',
    story: 'TRAVERSE is not about where you are going. It is about everything you cross to get there. Forests, cities, offices, airports, roads, unknown places.',
    line: 'Take the long way.',
    alt: 'TRAVERSE, a cognac leather weekender with a frame top and shoulder strap',
  },
  {
    id: 'strata', name: 'Strata', inspired: 'layers', type: 'Laptop briefcase', finish: 'Black, textured weave', glow: '#A39B91',
    fits: '15.6-inch laptop',
    story: 'Layers of earth. Layers of architecture. Layers of work, ambition and experience. Its vertical lines echo rock; its silhouette belongs in the city.',
    line: 'Built in layers.',
    alt: 'STRATA, a black laptop briefcase with a textured weave and top handles',
  },
  {
    id: 'crest', name: 'Crest', inspired: 'elevation', type: 'Backpack', finish: 'Brick red leather', glow: '#B8553A',
    fits: '15.6-inch laptop',
    story: 'Every wild landscape has a high point. A peak, a wave breaking, a bird in flight. CREST is that moment of elevation, a curved silhouette held by disciplined lines.',
    line: 'Rise above ordinary.',
    alt: 'CREST, a brick red leather backpack with side pockets',
  },
  {
    id: 'axis', name: 'Axis', inspired: 'direction', type: 'Vertical sling', finish: 'Cognac leather, brass zips', glow: '#D1A650',
    fits: '11-inch tablet',
    story: 'In nature, everything has a line of movement. A river finds its course. AXIS is built around one idea: everything begins with a line. Compact, focused, purposeful.',
    line: 'Nothing unnecessary.',
    alt: 'AXIS, a compact cognac leather vertical sling with brass zips',
  },
  {
    id: 'contour', name: 'Contour', inspired: 'form', type: 'Laptop folio', finish: 'Navy leather', glow: '#7F8DB5',
    fits: '14-inch laptop',
    story: 'Nature rarely follows a perfect line. It follows contours. CONTOUR shapes clean lines around what it protects. Minimal on the outside, considered on the inside.',
    line: 'Protection, shaped beautifully.',
    alt: 'CONTOUR, a navy leather laptop folio with a strap across the flap',
  },
];

export const HERO = {
  eyebrow: ['01', 'The idea'],
  title: 'Sharp lines outside. Your own edge inside.',
  body: 'Nature makes the lines: ridges, rock strata, the paths animals walk. Tuskrr gives them structure. The stitched channels on every bag are those lines, disciplined. We call it Linear Wilderness.',
  stats: [['Genuine', 'leather'], ['3-year', 'warranty'], ['Cash', 'on delivery']],
  meta: ['Genuine leather bags', 'For the person you’re becoming'],
};

export const PRELOADER_PILLS = [
  // x, y, size and tone follow STILL's pill layout; the text is Tuskrr's.
  { text: 'Genuine leather', x: '14%', y: '20%', size: 18, tone: 'ink', c: '#C27442' },
  { text: 'Cash on delivery', x: '74%', y: '16%', size: 13, tone: 'mist', c: '#D1A650' },
  { text: 'Ridge · terrain', x: '70%', y: '74%', size: 19, tone: 'ink', c: '#C27442' },
  { text: '3-year warranty', x: '12%', y: '72%', size: 12, tone: 'mist', c: '#A39B91' },
  { text: 'Strata · layers', x: '78%', y: '42%', size: 15, tone: 'ink', c: '#A39B91' },
  { text: 'Initials, embossed', x: '8%', y: '44%', size: 12, tone: 'mist', c: '#D1A650' },
  { text: 'Contour · form', x: '34%', y: '12%', size: 16, tone: 'ink', c: '#7F8DB5' },
  { text: 'Six bags, one line', x: '48%', y: '82%', size: 13, tone: 'mist', c: '#B8553A' },
];

// "Inside": the four confirmed proof points. count: what the counter shows.
export const INSIDE = [
  {
    id: 'leather', name: 'Genuine leather', sub: 'Every bag in the line', bag: 'traverse', halo: '#D39A6A',
    body: 'Real leather, cut and stitched into channels. It wears in, not out.',
    rows: [['What', 'Genuine leather'], ['Where', 'All six bags']],
    meter: { label: 'Bags in leather', from: 0, to: 6, of: 6, fmt: (v) => `${v} of 6` },
  },
  {
    id: 'warranty', name: '3-year warranty', sub: 'On every bag', bag: 'strata', halo: '#A39B91',
    body: 'Three years of cover. Carry it every working day. That is what it is for.',
    rows: [['What', 'Warranty'], ['Term', 'Three years']],
    meter: { label: 'Days covered', from: 0, to: 1095, of: 1095, fmt: (v) => v.toLocaleString('en-IN') },
  },
  {
    id: 'initials', name: 'Initials, embossed', sub: 'On custom order', bag: 'contour', halo: '#7F8DB5',
    body: 'Your initials, embossed. It turns a good bag into yours, or a gift into theirs.',
    rows: [['What', 'Custom initials'], ['Ready in', 'Two weeks']],
    meter: { label: 'Days to make', from: 0, to: 14, of: 14, fmt: (v) => `${v} days` },
  },
  {
    id: 'cod', name: 'Cash on delivery', sub: 'Pay when it is in your hands', bag: 'axis', halo: '#D1A650',
    body: 'Order now, pay when the bag arrives. No card needed.',
    rows: [['What', 'Cash on delivery'], ['You pay', 'When it arrives']],
    meter: { label: 'Paid upfront', from: 6000, to: 0, of: 6000, fmt: (v) => `₹${v.toLocaleString('en-IN')}` },
  },
];

export const DAY = {
  eyebrow: ['04', 'A day, in entrances'],
  title: 'Every day has ten seconds.',
  intro: 'The lobby. The meeting room. The pitch. Every day has ten seconds when you walk in and people look up. Tuskrr is built for those ten seconds.',
  chapters: [
    { time: '08:40', hour: '08', title: 'The lift lobby.', bag: 'ridge', slit: [38, 24],
      body: 'Coffee in one hand, RIDGE on one shoulder. Twenty floors to decide how today goes.' },
    { time: '10:00', hour: '10', title: 'The room where it gets decided.', bag: 'strata', slit: [30, 30],
      body: 'Six people, one table, ten seconds before anyone speaks. STRATA goes down flat and square. So do you.' },
    { time: '13:30', hour: '13', title: 'Across town.', bag: 'contour', slit: [44, 20],
      body: 'A client lunch, a laptop, nothing else. CONTOUR carries exactly that and looks like it meant to.' },
    { time: '19:15', hour: '19', title: 'Leaving late.', bag: 'axis', slit: [36, 18],
      body: 'The laptop stays at the desk tonight. Phone, keys, wallet, AXIS. Nothing unnecessary.' },
    { time: '22:10', hour: '22', title: 'The late flight.', bag: 'traverse', slit: [28, 36],
      body: 'Bengaluru tonight, Mumbai by breakfast. TRAVERSE goes in the overhead and comes out looking like it slept better than you did.' },
  ],
};

export const LINES = {
  eyebrow: ['05', 'Linear Wilderness'],
  title: 'Where’s that from?',
  sub: 'The question a good bag gets asked. The answer is a line from the landscape.',
  quotes: [
    ['Carry your own direction.', 'RIDGE', 'terrain'],
    ['Built in layers.', 'STRATA', 'layers'],
    ['Take the long way.', 'TRAVERSE', 'movement'],
  ],
};

export const GIFTS = {
  eyebrow: ['06', 'Shop and gifting'],
  title: 'Find yours, or send one.',
  sub: 'Genuine leather, ₹5,000 to ₹7,000. Cash on delivery. 3-year warranty.',
  columns: [
    ['For a milestone', [
      ['First job', 'First job. First real bag. Arrive like you mean it.', 'ridge'],
      ['New role', 'New role. Arrive like you mean it.', 'strata'],
      ['Promotion', 'Here’s to every room you walk into next.', 'contour'],
    ]],
    ['For a person', [
      ['Birthday', 'Used every working day, so you’re remembered every day.', 'crest'],
      ['Anniversary', 'I see who you’re becoming.', 'axis'],
      ['Initials, embossed', 'Their initials on it. Ready in 2 weeks.', 'contour'],
    ]],
    ['For a team', [
      ['Work anniversaries', 'STRATA and CONTOUR in volume, with a single enquiry.', 'strata'],
      ['Client gifts', 'A gift that goes to every meeting.', 'contour'],
      ['Welcome kits', 'Day one, sorted.', 'axis'],
    ]],
  ],
};

export const NAV = [['Collection', '#collection'], ['Inside', '#inside'], ['The day', '#day'], ['Gifting', '#shop']];
