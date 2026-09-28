// The Tuskrr brand foundation and the brand world, The Entrance, built on the
// ICP, the tagline "Arrive like you mean it." and Linear Wilderness from round 1.

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
    ['3-year warranty', 'confirmed'],
    ['Cash on delivery', 'confirmed'],
    ['Initials embossed on custom order, ready in 2 weeks', 'confirmed'],
    ['Laptop fit shown for every bag', 'sample sizes'],
    ['Free returns within 7 days of delivery', 'sample policy'],
  ],
  gifting: {
    notes: [
      'New role. Arrive like you mean it.',
      'First job. First real bag. Arrive like you mean it.',
      'Here’s to every room you walk into next.',
    ],
    initials: 'Your initials, embossed. A custom order, ready in 2 weeks.',
    corporate: 'Gifting for teams: STRATA and CONTOUR in volume, with a single enquiry.',
  },
  changed: [
    'One direction: The Entrance. The other directions from both rounds are retired.',
    'Linear Wilderness from round 1 stays as the idea underneath: nature\u2019s lines, given structure.',
    'The world is the city and the climb is a career. Mountains live in the product names and the textures.',
    'Designed for the phone first, with gifting and trust (genuine leather, 3-year warranty, cash on delivery) built in.',
  ],
};

// Laptop fit per bag. SAMPLE values for layout only; replace with real sizes.
export const LAPTOP = {
  ridge: '15.6-inch laptop',
  traverse: '16-inch laptop',
  strata: '15.6-inch laptop',
  crest: '15.6-inch laptop',
  axis: '11-inch tablet',
  contour: '14-inch laptop',
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
    file: 'the-entrance.html',
    reading: 'Every day has an entrance. Tuskrr is built for it.',
    headline: TAGLINE,
    intro: 'The lobby. The meeting room. The pitch. Every day has ten seconds when you walk in and people look up. This world is built for those ten seconds.',
    thesis: [
      ['The moment', 'Arrival is the brand’s stage. Doors, thresholds, the first step into a room. The bag is the thing in your hand when you walk in.'],
      ['The light', 'Everything happens in a vertical slit of warm light, like a door opening. It is the stitched channel on the bag, turned into light.'],
      ['The tone', 'Cinematic and assured. Dark rooms, warm leather, the gold S catching the light. Confidence without a single loud word.'],
    ],
    linear: {
      title: 'Linear Wilderness, underneath',
      text: 'The idea from round 1 stays as the foundation. Nature makes the lines: ridges, rock strata, the paths animals walk. Tuskrr gives them structure. The stitched channels on every bag are those lines, disciplined. The door of light is one of them, standing upright. And every product keeps its landscape: RIDGE for terrain, TRAVERSE for movement, STRATA for layers, CREST for elevation, AXIS for direction, CONTOUR for form.',
      pairs: [['Linear', 'The working life. Structure, the channels, the door of light.'], ['Wilderness', 'Who you are underneath it. Your own edge, the tusker, the landscape in every name.']],
    },
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
      text: 'A single vertical band of warm light, the width of one stitched channel, runs through the brand like a door left ajar. Products stand in it. Headlines sit beside it. Behind it, faint strata lines carry the wilderness into dark rooms. The gold S is the only other thing allowed to glow.',
      supports: ['The door of light', 'Channel rhythm', 'Strata texture', 'The gold S'],
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
      'Delivers the tagline with full weight. It looks and feels like an entrance.',
      'Keeps Linear Wilderness and the product stories, so nothing Tuskrr has already written is lost.',
      'Reads as the most premium of the three, which helps at ₹5,000 to ₹7,000.',
      'Simple to shoot: controlled light, studio and interiors.',
    ],
    watch: [
      'Dark, cinematic pages can tip into cold. The warmth has to come from the leather and the light.',
      'Less room for humour and everyday life, so the social feed needs a lighter second mode.',
    ],
  },

};

