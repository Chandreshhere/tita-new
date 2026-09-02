/**
 * "The Trinity" — TITA's three service pillars, from thisisthat.co.in/studio.
 */
export type ServiceGroup = {
  number: string
  title: string
  /** The bracketed subtitle TITA gives each pillar. */
  subtitle: string
  description: string
  items: string[]
}

export const serviceGroups: ServiceGroup[] = [
  {
    number: '01',
    title: 'Technology',
    subtitle: '(The Architecture)',
    description:
      'Web experiences that adapt to user behaviour. Digital journeys that feel intuitive, elegant, and conversion-led. Systems that work silently to drive efficiency and revenue.',
    items: [
      'Web Personalisation',
      'UI/UX',
      'Shopify Specialisation',
      'E-commerce Ecosystems',
      'Email Marketing',
      'Automations',
      'Chatbots',
    ],
  },
  {
    number: '02',
    title: 'Brand',
    subtitle: '(The Masterpiece)',
    description:
      'Crafting digital narratives that build visibility, community, and cultural relevance. Visual identities that communicate personality with clarity and distinction.',
    items: [
      'Social Media Marketing',
      'Content & Copywriting',
      'Graphic Design & Illustration',
      'Editing & Animation',
      'Film Production & Product Photography',
      'Campaign Planning',
      'Print, OOH, Mainline',
      'New Brand Launch & Rebranding',
    ],
  },
  {
    number: '03',
    title: 'Media',
    subtitle: '(The Amplifier)',
    description:
      'Data-driven acquisition strategies designed to convert attention into revenue. Allocating budgets intelligently to maximise reach, efficiency, and return.',
    items: [
      'Media Planning',
      'Performance Marketing',
      'Google Ads',
      'YouTube Marketing',
      'LinkedIn Marketing',
    ],
  },
]

/** "Chiaroscuro Marketing" — the philosophy section. */
export const PHILOSOPHY = {
  title: 'Chiaroscuro Marketing',
  rows: [
    { key: 'Light', value: 'Creativity' },
    { key: 'Shadow', value: 'Data' },
    { key: 'Together', value: 'Conversion' },
  ],
  lines: [
    'We believe in contrast.',
    'Emotion backed by numbers.',
    'Story powered by systems.',
  ],
  closer: 'Rebirth is not optional. It is inevitable.',
}

export type ManifestoQuote = { text: string; author: string[] }

/**
 * The manifesto band on the Services page.
 *
 * This used to be three near-empty "Call us if…" sections, each carrying a
 * full-bleed stock image (a marble statue, the Sistine hands) that had nothing
 * to do with the studio's work. The copy is TITA's own and worth keeping; the
 * borrowed art is not, so all three collapse into one block here and the page
 * shows real project photography instead — see `ServicesWorks`.
 */
export const manifesto = {
  label: 'Manifesto',
  caption: '[ Art. Intelligence. Impact. ]',
  title: "we don't run ads\n→ we orchestrate movements",
  body: [
    "We don't design posts. We paint legacies. This is the renaissance of brands.",
    'Once, art changed the world. Now, data does. We stand where both meet. We are not vendors — we are patrons of modern ambition.',
    'Every engagement begins with the same question: what would make this unmissable? The answer is never a template. It is a composition — of art, strategy, technology and performance, tuned to one brand and one market.',
    'TITA is a digital marketing agency born in Indore and now in Ahmedabad. Two cities. Two energies. One vision.',
  ],
  quotes: [
    {
      text: '\u201cWe believe in contrast. Emotion backed by numbers. Story powered by systems.\u201d',
      author: ['Chiaroscuro Marketing,', 'the TITA philosophy'],
    },
    {
      text: '\u201cRebirth is not optional. It is inevitable.\u201d',
      author: ['Ghazal Somaiya & Naamdasi Patel,', 'Founders'],
    },
  ] satisfies ManifestoQuote[],
}

/**
 * Client marks for the partnerships wall — ten, so the grid fills two clean
 * rows of five rather than leaving a ragged last row.
 *
 * These are dark marks on transparent or white grounds, which is why the band
 * they sit in is the light one: on the black band half of them disappeared.
 */
export const clientLogos: { src: string; name: string }[] = [
  { src: '/images/clients/kimirica.svg', name: 'Kimirica Hunter' },
  { src: '/images/clients/ozone-group.png', name: 'Ozone Group' },
  { src: '/images/clients/jlu.png', name: 'Jagran Lakecity University' },
  { src: '/images/clients/shrewsbury.svg', name: 'Shrewsbury International School' },
  { src: '/images/clients/bombay-hospital.png', name: 'Bombay Hospital Indore' },
  { src: '/images/clients/isak.png', name: 'ISAK' },
  { src: '/images/clients/mu20.png', name: 'MU20' },
  { src: '/images/clients/skyra.webp', name: 'Skyra' },
  { src: '/images/clients/roccia.png', name: 'Roccia' },
  { src: '/images/clients/denz-label.webp', name: 'Denz' },
]

export const servicesIntro =
  'We help brands be their most inspiring selves — at the intersection of art, strategy, technology and performance. Emotion backed by numbers. Story powered by systems.'
