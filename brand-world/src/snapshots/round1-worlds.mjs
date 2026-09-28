// The three brand-world options. Each is a different reading of the idea Tuskrr
// already named in its product deck, "Linear Wilderness": nature's lines made
// disciplined. Same sections, same order, same product facts in every option.

export const SECTIONS = [
  ['world', 'The world'],
  ['palette', 'Palette'],
  ['type', 'Typography'],
  ['device', 'Graphic language'],
  ['photo', 'Photography'],
  ['collection', 'The collection'],
  ['voice', 'Voice'],
  ['touch', 'Touchpoints'],
  ['web', 'The website'],
  ['verdict', 'Verdict'],
];

export const WORLDS = {
  a: {
    letter: 'A',
    name: 'Field Survey',
    file: 'option-a-field-survey.html',
    reading: 'Linear Wilderness, read as a map.',
    headline: 'The wild, measured.',
    intro: 'Tuskrr reads a landscape the way a surveyor does: in lines, levels and bearings. Then it builds those lines into leather. Every bag is a sheet in a survey of the wild, and its vertical channels are the contour lines.',
    thesis: [
      'The wilderness is not chaos. Seen from above it is a drawing: ridgelines, contours, the lines that water and animals leave behind. Tuskrr’s design language is that drawing, made exact.',
      'The mark already says this. An elephant, the most untamed shape we know, drawn as one disciplined line.',
      'This world makes Tuskrr the brand that pays attention. Precise without being cold, curious without being rugged. Closer to an architect’s notebook than a hiking catalogue.',
    ],
    feeling: ['Precise', 'Curious', 'Considered', 'Grounded'],
    palette: [
      { name: 'Survey Paper', hex: '#ECE8DF', role: 'Main ground' },
      { name: 'Sheet', hex: '#F6F3EC', role: 'Cards and raised surfaces' },
      { name: 'Field Ink', hex: '#1B1C1A', role: 'Type and the mark', note: '14.0:1 on paper' },
      { name: 'Slate', hex: '#2E4A4D', role: 'Second ground, depth, water', note: '7.8:1 on paper, any size' },
      { name: 'Cognac', hex: '#8A4722', role: 'The leather. Product colour', note: '5.7:1 on paper, any size' },
      { name: 'Bearing Gold', hex: '#8F6412', role: 'The gold S and markers', note: '4.3:1 on paper, display sizes only' },
      { name: 'Contour', hex: '#C9C1AF', role: 'Line work only', note: 'Decorative, never used for text' },
    ],
    type: {
      display: 'Archivo Condensed',
      displayWhy: 'Archivo at 62% width, set in capitals. Tall and narrow, like the Tuskrr wordmark itself.',
      text: 'Archivo',
      textWhy: 'The same family at normal width for reading. One family, two widths.',
      data: 'IBM Plex Mono',
      dataWhy: 'For sheet numbers, readings and specifications. The survey voice.',
    },
    device: {
      title: 'The contour',
      text: 'A topographic map runs underneath the brand like a watermark. Every product gets its own sheet, with a sheet number and a reading (terrain, movement, layers), the way a survey map is organised. Every fifth contour is an index line, drawn heavier, as on a real map.',
      supports: ['Contour field', 'Sheet numbers', 'Crosshair corners', 'Scale bars'],
    },
    photo: [
      ['Aerial terrain', 'Ranges seen from above in cool slate light, where the land already looks like line work.'],
      ['Product as specimen', 'Shot square-on or overhead on a paper-coloured ground, with a scale bar, like an object in a field journal.'],
      ['Hands and maps', 'Bags open on a table with notebooks and route plans. Intelligence over adrenaline.'],
      ['The grade', 'Cool shadows, warm leather. Slate and cognac are the two poles of every frame.'],
    ],
    voice: {
      summary: 'Precise, observant, quietly witty. Short statements that read like field notes. Readings and bearings, never exclamation marks.',
      samples: [
        ['Product caption', 'RIDGE. Sheet 01. Reading: terrain. The lines of a mountain, set in leather.'],
        ['Hang tag', 'Surveyed in the wild. Made for the city.'],
        ['Social post', 'Field note 04: a ridge is where two worlds meet. So is a good backpack.'],
        ['Launch email', 'New sheet added: CONTOUR'],
        ['Website 404', 'Off the map. Head back to base.'],
      ],
    },
    web: [
      ['Structure', 'A legend rail on the left holds the navigation, like the key on a map. The site scrolls as a set of sheets.'],
      ['Collection', 'A grid of numbered sheets that can be filtered by reading: terrain, movement, layers, elevation, direction, form.'],
      ['Product page', 'Opens as a sheet: large image, the reading, the story, then a specification panel set in mono.'],
      ['Motion', 'Slow, even reveals. The contour lines hold still. Nothing wobbles.'],
    ],
    strengths: [
      'The most ownable system of the three. Every future product gets a sheet and a reading, so the range can grow without new rules.',
      'The contour pattern is a ready-made print for linings, dust bags, tissue and boxes.',
      'Sits comfortably with all four leathers: cognac, black, brick and navy.',
    ],
    watch: [
      'Can drift toward outdoor gear or technology if the leather craft is not kept in front.',
      'The mono data voice needs discipline. Too many readings and it becomes a spreadsheet.',
    ],
  },

  b: {
    letter: 'B',
    name: 'Quiet Architecture',
    file: 'option-b-quiet-architecture.html',
    reading: 'Linear Wilderness, built as architecture.',
    headline: 'Every line has purpose.',
    intro: 'The wild leaves lines behind: in rock, in ridges, in grain. Cities build with the same lines: columns, fluting, facades. Tuskrr stands exactly between the two, and says as little as possible about it.',
    thesis: [
      'In this world the vertical channel is treated as architecture, like the fluting on a column or the ribs of a concrete facade. It is the one gesture, repeated with total discipline.',
      'Colour almost disappears. Carbon, concrete and bone, with the gold S as the single point of light, as it already appears on the STRATA and CONTOUR badges.',
      'This is Tuskrr for the city: the working day, gifting, the hotel lobby. The wilderness is present as material and line, not as scenery.',
    ],
    feeling: ['Restrained', 'Exact', 'Calm', 'Assured'],
    palette: [
      { name: 'Carbon', hex: '#121212', role: 'Main ground' },
      { name: 'Graphite', hex: '#1E1E1E', role: 'Raised surfaces' },
      { name: 'Concrete', hex: '#D8D6D1', role: 'Light ground. Stone' },
      { name: 'Bone', hex: '#ECEAE6', role: 'Type on dark', note: '15.6:1 on carbon' },
      { name: 'Stone', hex: '#9C988F', role: 'Second type on dark', note: '6.5:1 on carbon, any size' },
      { name: 'Brass', hex: '#C9A24A', role: 'The gold S. The only accent', note: '7.8:1 on carbon, any size' },
      { name: 'Brass Deep', hex: '#7A5F1E', role: 'Brass on concrete', note: '4.2:1 on concrete, display sizes only' },
    ],
    type: {
      display: 'Instrument Sans Condensed',
      displayWhy: 'Instrument Sans at 75% width in capitals with open tracking, close to the lettering on the metal badges.',
      text: 'Instrument Sans',
      textWhy: 'The same family at full width for reading.',
      data: 'Instrument Sans, small capitals',
      dataWhy: 'No second family at all. One typeface used with discipline is the typographic version of nothing unnecessary.',
    },
    device: {
      title: 'The channel',
      text: 'A field of fine vertical lines at the column rhythm of the page, the same rhythm as the stitched channels on the bags. Pages are cut into bands like geological strata. The gold S appears once per view, never more.',
      supports: ['Channel field', 'Strata bands', 'The gold S', 'Index numbers'],
    },
    photo: [
      ['Architecture as landscape', 'Fluted concrete, stone walls, stairwells, strong raking light.'],
      ['Product as sculpture', 'One bag on a stone plinth, side light, deep shadow.'],
      ['People in passing', 'A figure crossing a gallery or a lobby, bag in hand, never posing for the camera.'],
      ['The grade', 'Near monochrome. The leather is the only warm thing in the frame.'],
    ],
    voice: {
      summary: 'Terse, declarative, assured. Short sentences and full stops. No adjective that is not working. Says less than it could.',
      samples: [
        ['Product caption', 'STRATA. Layered. Built for the working day.'],
        ['Hang tag', 'Every line placed. Nothing added.'],
        ['Social post', 'Fewer things. Better lines.'],
        ['Launch email', 'CONTOUR. Now available.'],
        ['Website 404', 'Nothing here. Nothing unnecessary.'],
      ],
    },
    web: [
      ['Structure', 'An index. The collection is a numbered list of names, and choosing a row brings that product up in a pane beside it.'],
      ['Rhythm', 'Pages are cut into bands like strata, alternating carbon and concrete.'],
      ['Product page', 'One large image and three lines of copy. Detail sits below, for whoever wants it.'],
      ['Motion', 'Almost none. Fades only. Controls answer quickly and quietly.'],
    ],
    strengths: [
      'Reads as premium at first glance, and suits the corporate and gifting pieces (STRATA, CONTOUR).',
      'Turns the gold S from a one-off badge detail into a real brand asset.',
      'The simplest world to photograph: studio and architecture, no expeditions.',
    ],
    watch: [
      'The wild half of Linear Wilderness can disappear. Without care it becomes generic quiet luxury.',
      'Dark, minimal pages need very good photography to feel warm.',
    ],
  },

  c: {
    letter: 'C',
    name: 'High Ground',
    file: 'option-c-high-ground.html',
    reading: 'Linear Wilderness, walked as a journey.',
    headline: 'Take the long way.',
    intro: 'Tuskrr is made for the distance between here and there. Trails, cities, airports, the ridge at the end of the day. This world tells Tuskrr as a journey, in the warm hour when the landscape turns to line.',
    thesis: [
      'At dusk the wild simplifies. Ridges become silhouettes layered one behind another, and the land reads as pure line. That is the moment this world lives in.',
      'The tusker leads it: an animal that walks long distances and keeps to its routes. The mark is a traveller, not a trophy.',
      'Each product is a stage of the journey. The stories Tuskrr has already written, of rising, crossing and climbing, become the backbone of the voice.',
    ],
    feeling: ['Warm', 'Adventurous', 'Poetic', 'Human'],
    palette: [
      { name: 'Bark', hex: '#221610', role: 'Main ground' },
      { name: 'Bark Light', hex: '#2E1E16', role: 'Raised surfaces' },
      { name: 'Sand', hex: '#EBDDC7', role: 'Type on dark, light ground', note: '13.2:1 on bark' },
      { name: 'Dry Grass', hex: '#B9A68C', role: 'Second type on dark', note: '7.5:1 on bark, any size' },
      { name: 'Terracotta', hex: '#D0603F', role: 'Accent. CREST’s colour', note: '4.6:1 on bark, any size on bark only' },
      { name: 'Ember', hex: '#E39A5B', role: 'Highlights and links', note: '7.6:1 on bark, any size' },
      { name: 'Dusk', hex: '#8C6A8E', role: 'Sky and far ridges', note: '3.8:1 on bark, display sizes only' },
      { name: 'Terracotta Deep', hex: '#A2432A', role: 'Accent on sand', note: '4.7:1 on sand, any size' },
    ],
    type: {
      display: 'Instrument Serif',
      displayWhy: 'A narrow editorial serif with a true italic. It brings warmth and storytelling, and its height still echoes the wordmark.',
      text: 'Hanken Grotesk',
      textWhy: 'A clean grotesk for reading and labels, so the serif never has to work alone.',
      data: 'Hanken Grotesk, spaced capitals',
      dataWhy: 'Waypoints and labels in small spaced capitals.',
    },
    device: {
      title: 'The ridgeline',
      text: 'Layered silhouettes in dusk colours, back to front, and one elevation line that runs through the site and marks each product as a waypoint on the way up.',
      supports: ['Layered ridges', 'Elevation line', 'Waypoints', 'Film grain'],
    },
    photo: [
      ['Golden hour and dusk', 'Ridges, trails and roads in low warm light, with long shadows.'],
      ['Trails as lines', 'Paths cut through a landscape, seen from above or running away from the camera.'],
      ['People in motion', 'The bag on a shoulder, in a hand, mid-stride. Never static.'],
      ['The grade', 'Warm and filmic, with grain. Deep brown shadows, amber highlights.'],
    ],
    voice: {
      summary: 'Warm, rhythmic, second person. Short lines that build, the way the existing product stories do. Invites rather than instructs.',
      samples: [
        ['Product caption', 'CREST. Every wild landscape has a high point. Find yours.'],
        ['Hang tag', 'Made for the distance between here and there.'],
        ['Social post', 'The journey leaves the line. You follow it.'],
        ['Launch email', 'Your next high point is here.'],
        ['Website 404', 'This trail ends here. Take the long way back.'],
      ],
    },
    web: [
      ['Structure', 'A sequence of full-screen scenes. An elevation line fixed at the top of the screen fills as you scroll and marks each product as a waypoint.'],
      ['Collection', 'Walked in order, one product per scene, story first.'],
      ['Product page', 'Opens with the story over a landscape scene, then the details.'],
      ['Motion', 'Slow and cinematic. Scenes fade up, and the elevation line tracks the scroll.'],
    ],
    strengths: [
      'The most emotional of the three, and it uses the product stories Tuskrr has already written almost word for word.',
      'Strongest for a launch campaign, social and travel (TRAVERSE, RIDGE, CREST).',
      'The warm palette flatters the cognac and brick leathers.',
    ],
    watch: [
      'Needs real landscape and lifestyle photography to reach its potential. The most expensive world to shoot.',
      'Can read as a travel or outdoor brand. The lines and the discipline must stay visible.',
      'Navy (CONTOUR) and black (STRATA) sit less naturally in the warm palette.',
    ],
  },
};
