// Brand foundation (shared by every option) and the three brand-world options.
// v2: city-first, built on the ICP and the tagline "Arrive like you mean it."
// Every option carries the same foundation, products, proof points and gifting
// route; only the world, design, structure and voice differ.

export const TAGLINE = 'Arrive like you mean it.';

export const FOUNDATION = {
  tagline: TAGLINE,
  promise: 'For the person you’re becoming.',
  idea: 'Linear Wilderness: sharp lines on the outside, your own edge on the inside. The structure is the working life. The wild is who you are underneath it.',
  price: 'Accessible premium, ₹5,000 to ₹7,000. A planned treat, not a luxury purchase.',
  market: 'India first. Metro cities. Sold direct online (Instagram-led, bought on a phone) and as a gift.',
  material: 'Genuine leather.',
  icp: {
    title: 'The early-career climber',
    age: '24 to 34',
    who: 'Lives in Bengaluru, Mumbai, Delhi NCR, Pune or Hyderabad. Works in tech, startups, consulting, design, media or finance. Smart-casual, hybrid, never a suit.',
    life: 'Commutes, flies between metros for work, gets out of the city at the weekend. Has upgraded the phone, the watch and the sneakers. The bag is still the company-issue black nylon backpack the whole floor carries.',
    money: '₹6,000 is affordable but still a decision. They wishlist it, then buy on payday, at a promotion or in a sale.',
    first: 'For many, this is their first grown-up bag: the first good thing bought with their own salary.',
  },
  secondary: [
    ['The gift giver', 'A partner, sibling or parent marking a first job, a promotion, a birthday or an anniversary. ₹5,000 to ₹7,000 is the sweet spot for a gift that feels significant, and a bag is used every working day, so the giver is remembered every day.'],
    ['Corporate gifting', 'STRATA and CONTOUR for Diwali, work anniversaries and client gifts.'],
  ],
  notFor: 'Hikers and outdoor buyers. Logo-seekers. Suit-only formal buyers.',
  triggers: [
    ['The self-buyer', 'I’ve levelled up. My bag hasn’t.', 'The payoff is not owning the bag. It is the moment a colleague asks, “Where’s that from?”'],
    ['The gift giver', 'I see who you’re becoming.', 'A gift that goes to every meeting, every flight, every day.'],
  ],
  emotion: 'Pride in who you’re becoming.',
  personality: [
    ['Confident', 'not loud'],
    ['Sharp', 'not corporate'],
    ['Warm', 'not soft'],
    ['A little wild', 'not rugged'],
  ],
  voice: [
    'Second person. Talk to them, not about the bag.',
    'Short, declarative lines. No exclamation marks.',
    'Dry wit is welcome. Hype is not.',
    'Never say premium, luxury, crafted with love or elevate.',
    'The price is never a discount story. "Looks far more expensive than it is" is felt, never said.',
  ],
  proof: [
    ['Genuine leather', 'confirmed'],
    ['Initials embossed, on custom order', 'confirmed'],
    ['Fits a [__]-inch laptop, per bag', 'to confirm'],
    ['[__]-year warranty', 'to confirm'],
    ['Easy returns', 'to confirm'],
    ['Cash on delivery', 'to confirm'],
  ],
  gifting: {
    notes: [
      'New role. Arrive like you mean it.',
      'First job. First real bag. Arrive like you mean it.',
      'Here’s to every room you walk into next.',
    ],
    initials: 'Your initials, embossed. Available on custom order.',
    corporate: 'Gifting for teams: STRATA and CONTOUR in volume, with a single enquiry.',
    diwali: 'Diwali gifting: order by [date to confirm] for delivery before the festival.',
  },
  changed: [
    'Mountains move from scenery to texture. They stay in the product names and the graphic language; the world itself is the city.',
    'The climb is a career, not a trek.',
    'Every option is designed for the phone first, because that is where Tuskrr will be found and bought.',
    'Gifting and trust (genuine leather, laptop fit, warranty, returns) are built into the site, not bolted on.',
  ],
};

export const SECTIONS = [
  ['idea', 'The idea'],
  ['palette', 'Palette'],
  ['type', 'Typography'],
  ['device', 'Graphic language'],
  ['photo', 'Photography'],
  ['collection', 'The collection'],
  ['voice', 'Voice'],
  ['gifting', 'Gifting'],
  ['phone', 'On the phone'],
  ['verdict', 'Verdict'],
];

export const WORLDS = {
  a: {
    letter: 'A',
    name: 'The Entrance',
    file: 'option-a-the-entrance.html',
    reading: 'Every day has an entrance. Tuskrr is built for it.',
    headline: TAGLINE,
    intro: 'The lobby. The meeting room. The pitch. Every day has ten seconds when you walk in and people look up. This world is built for those ten seconds.',
    thesis: [
      ['The moment', 'Arrival is the brand’s stage. Doors, thresholds, the first step into a room. The bag is the thing in your hand when you walk in.'],
      ['The light', 'Everything happens in a vertical slit of warm light, like a door opening. It is the stitched channel on the bag, turned into light.'],
      ['The tone', 'Cinematic and assured. Dark rooms, warm leather, the gold S catching the light. Confidence without a single loud word.'],
    ],
    feeling: ['Assured', 'Cinematic', 'Sharp', 'Warm'],
    palette: [
      { name: 'Night', hex: '#131110', role: 'Main ground' },
      { name: 'Room', hex: '#1F1B19', role: 'Raised surfaces' },
      { name: 'Bone', hex: '#EFE9E1', role: 'Type on dark, light ground', note: '15.6:1 on night' },
      { name: 'Smoke', hex: '#A39B91', role: 'Second type on dark', note: '6.9:1 on night, any size' },
      { name: 'Cognac', hex: '#C27442', role: 'Leather, links on dark', note: '5.3:1 on night, any size' },
      { name: 'Brass', hex: '#D1A650', role: 'The gold S, one accent per view', note: '8.3:1 on night, any size' },
      { name: 'Threshold', hex: '#F6E3BD', role: 'The door of light', note: 'Light only, never text' },
    ],
    type: {
      display: 'Instrument Sans Condensed',
      displayWhy: 'Instrument Sans at 75% width, in capitals. Tall and narrow like the Tuskrr wordmark, and like a doorway.',
      text: 'Instrument Sans',
      textWhy: 'The same family at full width for reading. One family keeps it disciplined.',
      data: 'Instrument Sans, spaced capitals',
      dataWhy: 'Labels, prices and product facts, set small with open tracking.',
    },
    device: {
      title: 'The threshold',
      text: 'A single vertical band of warm light, the width of one stitched channel, runs through the brand like a door left ajar. Products stand in it. Headlines sit beside it. The gold S is the only other thing allowed to glow.',
      supports: ['The door of light', 'Channel rhythm', 'The gold S', 'Dark rooms'],
    },
    photo: [
      ['Walking in', 'The first step through a door: office lobbies, glass doors, a meeting room, shot from inside the room looking at the person arriving.'],
      ['Light on leather', 'Product in a single raking beam, the rest of the frame in shadow. The channels catch the light.'],
      ['The city at night', 'Leaving late, arriving early. Streetlight, lift lobbies, airport corridors.'],
      ['The grade', 'Deep warm shadow, amber highlights, never blue. Leather is the brightest warm thing in the frame.'],
    ],
    voice: {
      summary: 'Assured and cinematic. Few words, each one landing. Speaks to the moment of walking in.',
      samples: [
        ['Product caption', 'STRATA. For the room where it gets decided.'],
        ['Hang tag', 'Arrive like you mean it.'],
        ['Social post', 'Ten seconds. That’s how long the door takes to close behind you.'],
        ['Launch email', 'Your next entrance, sorted.'],
        ['Website 404', 'Wrong door. Try this one.'],
      ],
    },
    phone: [
      ['First screen', 'Dark, with the door of light down the middle and one bag standing in it. The tagline above, two buttons below: Shop and Gift.'],
      ['Collection', 'A numbered index of names. Tap a name and the bag steps into the light.'],
      ['Product page', 'The bag in the light, the price, the laptop fit and the proof points before the story.'],
      ['Motion', 'Slow fades, like a door opening. Controls answer instantly.'],
    ],
    strengths: [
      'Delivers the tagline with the most weight. It looks and feels like an entrance.',
      'Reads as the most premium of the three, which helps at ₹5,000 to ₹7,000.',
      'Simple to shoot: controlled light, studio and interiors.',
    ],
    watch: [
      'Dark, cinematic pages can tip into cold. The warmth has to come from the leather and the light.',
      'Less room for humour and everyday life, so the social feed needs a lighter second mode.',
    ],
  },

  b: {
    letter: 'B',
    name: 'Monday to Monday',
    file: 'option-b-monday-to-monday.html',
    reading: 'The climb is your week. Tuskrr is there for all of it.',
    headline: TAGLINE,
    intro: 'The climb isn’t a mountain. It’s your week: the 8:40 commute, the pitch at 10:30, the flight out on Friday, the hill you climb on Saturday. This world follows the day, and the bag that goes through all of it.',
    thesis: [
      ['The week', 'Every product has a moment in the week. The site is walked like a day, from the morning commute to the weekend.'],
      ['The line', 'The metro line is the graphic: one straight route through the city with stations at the times that matter. Linear by day, wild at the weekend.'],
      ['The tone', 'Warm, human and rhythmic. Real people, real cities, the light changing through the day.'],
    ],
    feeling: ['Warm', 'Human', 'Rhythmic', 'Ambitious'],
    palette: [
      { name: 'Sand', hex: '#F1E6D6', role: 'Day ground' },
      { name: 'Card', hex: '#FBF5EC', role: 'Raised surfaces' },
      { name: 'Night Navy', hex: '#1C2433', role: 'Type, evening ground', note: '12.6:1 on sand' },
      { name: 'Dust', hex: '#6A5D4E', role: 'Second type on sand', note: '5.2:1 on sand, any size' },
      { name: 'Terracotta', hex: '#AC4428', role: 'Accent, CREST’s colour', note: '4.7:1 on sand, any size' },
      { name: 'Cognac', hex: '#8A4722', role: 'Leather', note: '5.7:1 on sand, any size' },
      { name: 'Streetlight', hex: '#E7A554', role: 'Accent after dark', note: '7.3:1 on navy, any size' },
    ],
    type: {
      display: 'Instrument Serif',
      displayWhy: 'A narrow editorial serif with a true italic. Warm, human, and still tall like the wordmark.',
      text: 'Hanken Grotesk',
      textWhy: 'A clean grotesk for reading, prices and product facts.',
      data: 'Hanken Grotesk, tabular figures',
      dataWhy: 'Times of day set like a departures board: 08:40, 10:30, 18:15.',
    },
    device: {
      title: 'The route',
      text: 'One straight metro line runs through the site with a station at each moment of the week. The line is the stitched channel turned sideways. At the weekend it bends, because Saturday is the wild half of Linear Wilderness.',
      supports: ['The route', 'Station times', 'Day to night colour', 'Film grain'],
    },
    photo: [
      ['The commute', 'Metro platforms, auto-rickshaws, flyovers at 8:40. The bag on a shoulder, in motion.'],
      ['At work', 'Co-working desks, meeting rooms, a laptop coming out of STRATA. Real offices, real light.'],
      ['After hours', 'A rooftop, a dinner, the drive home. AXIS across the body, city lights behind.'],
      ['The weekend', 'An airport on Friday, a hill trail on Saturday morning. The only place mountains appear.'],
    ],
    voice: {
      summary: 'Warm and rhythmic, second person, with times and places. Reads like someone who knows your week.',
      samples: [
        ['Product caption', 'RIDGE. 08:40, Monday. Arrive like you mean it.'],
        ['Hang tag', 'For every Monday you walk in ready.'],
        ['Social post', '10:30. The pitch. You’ve got this, and the laptop fits.'],
        ['Launch email', 'Friday, 18:15. Your weekend bag is here.'],
        ['Website 404', 'Wrong stop. Next one’s this way.'],
      ],
    },
    phone: [
      ['First screen', 'The tagline over a drawn city at morning light, with the route line underneath. Two buttons: Shop the week and Gift it.'],
      ['Collection', 'Walked as a day: one product per station, time first, story second.'],
      ['Product page', 'The moment it’s for, the price, laptop fit and proof points, then the story.'],
      ['Motion', 'The route line fills as you scroll. Scenes fade up gently.'],
    ],
    strengths: [
      'Speaks most directly to the ICP’s real life, and the day-in-the-life format is native to Instagram Reels.',
      'Gives every product a clear job, which makes choosing (and gifting) easier.',
      'Keeps a little of the original mountain story, in the right place: the weekend.',
    ],
    watch: [
      'Needs a real lifestyle shoot across several city locations. The most expensive world to photograph.',
      'Warm and human can slide toward ordinary. The lines and the discipline must stay visible.',
    ],
  },

  c: {
    letter: 'C',
    name: 'Sharp Lines, Wild Heart',
    file: 'option-c-sharp-lines.html',
    reading: 'Structure on the outside. Your own edge on the inside.',
    headline: TAGLINE,
    intro: 'Straight lines for the working world. One line that goes its own way. This world is Tuskrr at its most editorial and its most fun: the bag that gets you asked, “Where’s that from?”',
    thesis: [
      ['The device', 'Eleven straight channel lines, and one that refuses to stay straight. It is Linear Wilderness in a single picture, and it can move.'],
      ['The attitude', 'Editorial, like a good magazine: confident layouts, big type, a sense of humour. Cool without trying.'],
      ['The tone', 'Sharp and a little cheeky. It knows the office rules and wears them its own way.'],
    ],
    feeling: ['Sharp', 'Witty', 'Cool', 'A little wild'],
    palette: [
      { name: 'Paper', hex: '#F5F3EE', role: 'Main ground' },
      { name: 'White', hex: '#FFFFFF', role: 'Product and cards' },
      { name: 'Ink', hex: '#111111', role: 'Type, dark ground', note: '17.0:1 on paper' },
      { name: 'Grey', hex: '#5F5C57', role: 'Second type on paper', note: '6.0:1 on paper, any size' },
      { name: 'Wild', hex: '#E0492A', role: 'The wild line', note: '3.7:1 on paper, display only; 4.6:1 on ink, any size' },
      { name: 'Wild Deep', hex: '#B83418', role: 'Wild as text on paper', note: '5.4:1 on paper, any size' },
      { name: 'Gold S', hex: '#C89A2C', role: 'The S, on ink only', note: '7.3:1 on ink, any size' },
    ],
    type: {
      display: 'Archivo Condensed',
      displayWhy: 'Archivo at 62% width, heavy, in capitals. Tall and narrow like the wordmark, loud like a magazine cover.',
      text: 'Archivo',
      textWhy: 'The same family at normal width for reading.',
      data: 'IBM Plex Mono',
      dataWhy: 'Captions, prices and the “Where’s that from?” labels. The editor’s voice.',
    },
    device: {
      title: 'The wild line',
      text: 'Straight parallel lines, the rhythm of the stitched channels, with one line in Wild red that bends its own way. It works as a pattern, a divider, a loading line and a lining print. On the site it moves, slowly.',
      supports: ['Channel lines', 'The wild line', 'Big type', 'Editor’s captions'],
    },
    photo: [
      ['Street editorial', 'Shot like a fashion story on real city streets: flat light, strong poses, clean backgrounds.'],
      ['The detail', 'Close-ups of stitching, the channels, the gold S, initials being embossed.'],
      ['Caught in the wild', 'The bag in unexpected places: a scooter, a chai stall, a gallery bench. Humour, never a joke.'],
      ['The grade', 'Clean and bright, true colour, with one red thing in every frame.'],
    ],
    voice: {
      summary: 'Sharp, witty, a little cheeky. Short lines with a twist. Knows the rules and bends one.',
      samples: [
        ['Product caption', 'CONTOUR. Minimal outside. Your whole life inside.'],
        ['Hang tag', 'Sharp lines. Wild heart.'],
        ['Social post', 'Where’s that from? You’ll get asked. Say Tuskrr.'],
        ['Launch email', 'Your company backpack called. It’s over.'],
        ['Website 404', 'This page went its own way.'],
      ],
    },
    phone: [
      ['First screen', 'The tagline huge in black, the wild line running beside it, one bag on white. Two buttons: Shop and Gift.'],
      ['Collection', 'A magazine grid of the six bags, each with an editor’s caption.'],
      ['Product page', 'Big image, price, laptop fit and proof points, then the story in a pull quote.'],
      ['Motion', 'The wild line drifts slowly. Everything else is still.'],
    ],
    strengths: [
      'The most distinctive and ownable. The wild line can become Tuskrr’s signature, like a check or a stripe.',
      'Built for Instagram and the youngest end of the ICP. It has the most personality.',
      'The lightest pages and the cheapest to keep fresh on social.',
    ],
    watch: [
      'The cheekiness may not suit corporate gifting buyers. Keep the gifting pages calmer.',
      'A light editorial look can undersell the leather if the photography is not strong.',
    ],
  },
};

// The Monday to Monday route: product order by time of the week.
export const ROUTE = [
  ['ridge', '08:40', 'Monday', 'The commute'],
  ['strata', '10:30', 'Tuesday', 'The pitch'],
  ['contour', '15:00', 'Wednesday', 'The client meeting'],
  ['axis', '20:30', 'Thursday', 'After hours'],
  ['traverse', '18:15', 'Friday', 'The flight out'],
  ['crest', '06:00', 'Saturday', 'The high point'],
];
