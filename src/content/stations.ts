import type { ChoiceOption, Station } from '../lib/types';

/**
 * The treasure hunt route through Nallurhalli Sponge Park, in suggested order.
 *
 * To change the hunt, edit this file — no other code needs to change.
 * - `code` is what the QR sign at that spot encodes (see README → "Printing QR signs").
 * - `coords` are left unset until someone walks the park with Organiser tools → "Capture GPS".
 * - Kannada (`kn`) is optional per string; missing text falls back to English.
 */

const notSure: ChoiceOption = { value: 'not_sure', emoji: '🤔', label: { en: 'Not sure', kn: 'ಗೊತ್ತಿಲ್ಲ' } };

export const stations: Station[] = [
  {
    id: 'start',
    code: 'SP-START',
    emoji: '🪧',
    name: { en: 'Welcome Board', kn: 'ಸ್ವಾಗತ ಫಲಕ' },
    clue: {
      explorer: { en: 'Every adventure starts somewhere! Find the big board near the park entrance with a QR code on it.' },
      expert: { en: 'Begin at the project signboard by the main entrance.' },
    },
    learn: {
      explorer: {
        en: 'This park is a SPONGE! 🧽\n\nWhen rain falls on a concrete road, the water can’t get in. It rushes away and floods the street.\n\nA sponge park catches the rain, slows it down, cleans it, and lets it soak into the ground — just like a kitchen sponge soaks up water.',
      },
      expert: {
        en: 'Nallurhalli is a “sponge park”: a network of nature-based interventions — bioswales, recharge structures and planting — designed to slow, store, infiltrate and clean urban stormwater.\n\nHard surfaces send rain straight into drains, causing flash floods and wasting water that could refill the aquifer. This park is designed to do the opposite.\n\nIt is being built by WELL Labs’ Urban Water Programme. The people who live around it are its best custodians.',
      },
    },
    challenge: {
      type: 'quiz',
      question: { en: 'When it rains on concrete, what happens to the water?' },
      options: [
        { en: 'It soaks into the ground' },
        { en: 'It runs off fast and can flood the street' },
        { en: 'It disappears' },
      ],
      answer: 1,
      explain: { en: 'Concrete is hard, so water can’t get in — it rushes off instead. That’s why the city needs sponges!' },
    },
  },
  {
    id: 'swale',
    code: 'SP-SWALE',
    emoji: '🌾',
    name: { en: 'Bioswale', kn: 'ಬಯೋಸ್ವೇಲ್ (ಹಸಿರು ಕಾಲುವೆ)' },
    clue: {
      explorer: { en: 'I’m a long, low, green ditch. When rain comes, water walks slowly through me. Find me!' },
      expert: { en: 'Look for a shallow, planted channel running along the natural flow path of water.' },
    },
    learn: {
      explorer: {
        en: 'A bioswale is a shallow ditch full of plants and soil.\n\nRainwater flows in slowly. The plants and soil work like a filter — they catch mud and dirt — and the clean water soaks down into the ground.',
      },
      expert: {
        en: 'A bioswale is a gently sloped, vegetated channel. Instead of piping stormwater away, it conveys it slowly: sediment settles, roots and soil filter out pollutants, and water has time to infiltrate.\n\nThe result is lower peak runoff during heavy rain and less load on the storm drains downstream.',
      },
    },
    challenge: {
      type: 'quiz',
      question: { en: 'Why does the bioswale have plants in it?' },
      options: [
        { en: 'To slow down and clean the water' },
        { en: 'Only to look pretty' },
        { en: 'To stop any water coming in' },
      ],
      answer: 0,
      explain: { en: 'Roots and leaves slow the water and trap dirt, so cleaner water soaks into the ground.' },
    },
  },
  {
    id: 'inlet',
    code: 'SP-INLET',
    emoji: '🚪',
    name: { en: 'Water Inlet', kn: 'ನೀರಿನ ಒಳಹರಿವು' },
    clue: {
      explorer: { en: 'Water needs a door to come in! Find the opening where rainwater enters the park.' },
      expert: { en: 'Find an inlet — the point where runoff from streets or paths enters a structure.' },
    },
    learn: {
      explorer: {
        en: 'An inlet is a door for water. 🚪💧\n\nIf garbage or mud blocks the door, water can’t get in. It stays on the road, makes floods, and mosquitoes can grow in it.\n\nKeeping inlets clean keeps the whole park working!',
      },
      expert: {
        en: 'Inlets and outlets control where water enters and leaves each intervention. They are the most common point of failure: litter and silt clog them, water backs up, and the structure stops working — often leaving stagnant pools where mosquitoes breed.\n\nA quick visual check after rain is one of the most useful observations anyone can make.',
      },
    },
    safety: { en: 'Look from the side. Don’t put your hands inside.', kn: 'ಪಕ್ಕದಿಂದ ನೋಡಿ. ಕೈ ಒಳಗೆ ಹಾಕಬೇಡಿ.' },
    challenge: {
      type: 'observe',
      intro: { en: 'Be a park scientist! Look carefully and tell us what you see.' },
      prompts: [
        {
          id: 'inlet_state',
          kind: 'choice',
          label: { en: 'Is the inlet clear?' },
          options: [
            { value: 'clear', emoji: '✅', label: { en: 'Clear' } },
            { value: 'some_litter', emoji: '🟡', label: { en: 'Some litter or mud' } },
            { value: 'blocked', emoji: '🔴', label: { en: 'Blocked' }, flag: true },
            notSure,
          ],
        },
      ],
    },
  },
  {
    id: 'recharge',
    code: 'SP-RECHARGE',
    emoji: '💧',
    name: { en: 'Recharge Well', kn: 'ಮರುಪೂರಣ ಬಾವಿ' },
    clue: {
      explorer: { en: 'I send water deep, deep down to fill the wells under your feet. Look for my painted measuring stick!' },
      expert: { en: 'Find the recharge structure — look for the painted staff gauge that marks the water level.' },
    },
    learn: {
      explorer: {
        en: 'Under the ground there is hidden water called groundwater. Borewells pull it up for our homes.\n\nA recharge well lets rainwater go back down to fill it up again — like putting money back into a piggy bank! 🐷\n\nThe painted stick tells us how much water is inside.',
      },
      expert: {
        en: 'Bengaluru draws heavily on groundwater through borewells, and water tables have fallen. Recharge structures route filtered stormwater down into permeable layers to replenish the aquifer.\n\nThe painted staff gauge lets observers read the water level and track how fast the structure drains after rain — a direct measure of whether it is working.',
      },
    },
    safety: {
      en: '⚠️ Look only. Never climb, lean over, or go into the recharge well.',
      kn: '⚠️ ನೋಡಿ ಮಾತ್ರ. ಬಾವಿಯ ಮೇಲೆ ಹತ್ತಬೇಡಿ, ಬಗ್ಗಬೇಡಿ ಅಥವಾ ಒಳಗೆ ಇಳಿಯಬೇಡಿ.',
    },
    challenge: {
      type: 'observe',
      intro: { en: 'Read the painted stick from a safe distance.' },
      prompts: [
        {
          id: 'water_level',
          kind: 'choice',
          label: { en: 'Where is the water on the measuring stick?' },
          options: [
            { value: 'dry', emoji: '🏜️', label: { en: 'Dry' } },
            { value: 'low', emoji: '🔹', label: { en: 'Low' } },
            { value: 'middle', emoji: '🔷', label: { en: 'Middle' } },
            { value: 'high', emoji: '🌊', label: { en: 'High' } },
            notSure,
          ],
        },
        {
          id: 'water_look',
          kind: 'choice',
          label: { en: 'How does the water look and smell?' },
          options: [
            { value: 'clear', emoji: '✨', label: { en: 'Clear, no smell' } },
            { value: 'muddy', emoji: '🟤', label: { en: 'Muddy' } },
            { value: 'green_black_smelly', emoji: '🤢', label: { en: 'Green/black or smelly' }, flag: true },
            { value: 'no_water', emoji: '➖', label: { en: 'No water' } },
          ],
        },
      ],
    },
  },
  {
    id: 'plants',
    code: 'SP-PLANTS',
    emoji: '🌱',
    name: { en: 'Native Garden', kn: 'ಸ್ಥಳೀಯ ಸಸ್ಯಗಳ ತೋಟ' },
    clue: {
      explorer: { en: 'We are green, we are growing, and butterflies love us. Find the new plants!' },
      expert: { en: 'Locate the native planting beds.' },
    },
    learn: {
      explorer: {
        en: 'These are native plants — plants that have always grown around Bengaluru.\n\n🌿 Their deep roots make tiny tunnels so water can soak in.\n🌳 They give shade and cool the park.\n🦋 They feed birds and butterflies.',
      },
      expert: {
        en: 'Native species are adapted to local rainfall and need little irrigation once established. Their deep roots keep soil porous and improve infiltration.\n\nCanopy and ground cover lower surface temperatures, hold soil against erosion, and provide habitat for pollinators and birds.',
      },
    },
    challenge: {
      type: 'observe',
      intro: { en: 'Check on the plants — they can’t tell us how they feel!' },
      prompts: [
        {
          id: 'plant_health',
          kind: 'choice',
          label: { en: 'How are the plants doing?' },
          options: [
            { value: 'thriving', emoji: '😀', label: { en: 'Green & growing' } },
            { value: 'ok', emoji: '🙂', label: { en: 'Okay' } },
            { value: 'wilting', emoji: '😟', label: { en: 'Wilting' } },
            { value: 'many_dead', emoji: '💀', label: { en: 'Many are dead' }, flag: true },
          ],
        },
      ],
    },
  },
  {
    id: 'gauge',
    code: 'SP-GAUGE',
    emoji: '🌧️',
    name: { en: 'Rain Gauge', kn: 'ಮಳೆ ಮಾಪಕ' },
    clue: {
      explorer: { en: 'I’m a tall cup that counts the rain. Find me standing out in the open!' },
      expert: { en: 'Find the rain gauge — it needs open sky above it.' },
    },
    learn: {
      explorer: {
        en: 'A rain gauge catches rain so we can measure how much fell.\n\nWe measure rain in millimetres (mm). 10 mm of rain means the ground would be covered in water about as deep as your finger is thick! ☝️',
      },
      expert: {
        en: 'Rainfall is measured as a depth in millimetres. On its own it is just weather data — but paired with observations of how quickly the park drains afterwards, it tells us how well the interventions are performing.\n\nThis pairing is the core of the park’s baseline monitoring.',
      },
    },
    challenge: {
      type: 'observe',
      intro: { en: 'Read the gauge without tipping it over.' },
      prompts: [
        {
          id: 'rained_recently',
          kind: 'choice',
          label: { en: 'Has it rained since yesterday?' },
          options: [
            { value: 'yes', emoji: '🌧️', label: { en: 'Yes' } },
            { value: 'no', emoji: '☀️', label: { en: 'No' } },
            notSure,
          ],
        },
        { id: 'rain_mm', kind: 'number', label: { en: 'What number does the gauge show? (skip if you can’t read it)' }, unit: 'mm' },
      ],
    },
  },
  {
    id: 'photo',
    code: 'SP-PHOTO',
    emoji: '📸',
    name: { en: 'Photo Point', kn: 'ಫೋಟೋ ಸ್ಥಳ' },
    clue: {
      explorer: { en: 'Find the footprints painted on the ground. Stand on them like a statue! 🗿' },
      expert: { en: 'Find the marked photo-point: stand on the footprints and face the direction of the arrow.' },
    },
    learn: {
      explorer: {
        en: 'Scientists take the SAME photo from the SAME spot again and again.\n\nLater they put the photos side by side and can see the park change — plants growing, water coming and going, seasons changing!',
      },
      expert: {
        en: 'Repeat photography from a fixed point is one of the simplest and most robust monitoring methods.\n\nOver months, the photo series documents vegetation establishment, erosion and water presence — evidence that is hard to capture any other way.',
      },
    },
    challenge: {
      type: 'photo',
      instruction: { en: 'Stand on the footprints, face the arrow, and take one photo.' },
    },
  },
  {
    id: 'nature',
    code: 'SP-NATURE',
    emoji: '🦋',
    name: { en: 'Nature Spot', kn: 'ಪ್ರಕೃತಿ ತಾಣ' },
    clue: {
      explorer: { en: 'Shhh! Be quiet like a cat 🐈 and look for wings. Find the nature spot!' },
      expert: { en: 'Head to the biodiversity observation spot.' },
    },
    learn: {
      explorer: {
        en: 'When a park is healthy, animals come to live in it!\n\nButterflies, bees, birds and dragonflies are signs that the park is doing a good job.',
      },
      expert: {
        en: 'Pollinators and birds are useful indicators of ecological health. Simple timed counts, repeated over the seasons, show whether the planting is creating real habitat.',
      },
    },
    challenge: {
      type: 'observe',
      intro: { en: 'Stay still for one minute and count.' },
      prompts: [
        { id: 'butterflies', kind: 'number', label: { en: 'How many butterflies did you count in 1 minute?' } },
        {
          id: 'birds',
          kind: 'choice',
          label: { en: 'Did you see or hear birds?' },
          options: [
            { value: 'many', emoji: '🐦🐦🐦', label: { en: 'Many' } },
            { value: 'few', emoji: '🐦', label: { en: 'A few' } },
            { value: 'none', emoji: '🚫', label: { en: 'None' } },
          ],
        },
      ],
    },
  },
];

/** QR code that opens the "Sponge Park Watch" report form instead of a station. */
export const WATCH_CODE = 'SP-WATCH';

export const stationById = (id: string) => stations.find((s) => s.id === id);
