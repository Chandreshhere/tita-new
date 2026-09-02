/**
 * Brand-level constants for TITA (This Is That Agency), from thisisthat.co.in.
 * Everything the chrome needs — wordmark, offices, founders, contact points.
 */
export const SITE = {
  name: 'TITA',
  longName: 'This Is That Agency',
  tagline: 'Art. Intelligence. Impact.',
  /** The line the hero and the meta description both carry. */
  proposition:
    'Marketing is no longer made. It is composed. Where art meets algorithm.',
  founded: 'EST. MMXXI',
  founders: ['Ghazal Somaiya', 'Naamdasi Patel'],
  email: 'naamdasi@thisisthat.co.in',
  phone: '+91 7000918312',
  phoneHref: 'tel:+917000918312',
  copyright: `© TITA ${new Date().getFullYear()}. All rights reserved.`,
} as const

export type Office = {
  city: string
  coords: string
  lat: string
  lng: string
}

export const OFFICES: Office[] = [
  { city: 'Indore', coords: '22.7196° N, 75.8577° E', lat: '22.7196', lng: '75.8577' },
  { city: 'Ahmedabad', coords: '23.0225° N, 72.5714° E', lat: '23.0225', lng: '72.5714' },
]

/** The four disciplines TITA leads with. */
export const PILLARS = ['Art', 'Strategy', 'Technology', 'Performance'] as const

/** The manifesto that runs under the hero. */
export const MANIFESTO = [
  'Once, art changed the world.',
  'Now, data does.',
  'We stand where both meet.',
  'We are not vendors.',
  'We are patrons of modern ambition.',
] as const

export const MANIFESTO_TWO = [
  "We don't run ads.",
  'We orchestrate movements.',
  "We don't design posts.",
  'We paint legacies.',
  'This is the renaissance of brands.',
] as const

export const MARQUEE = 'We orchestrate movements'
