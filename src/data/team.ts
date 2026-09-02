import { OFFICES, SITE } from './site'

export type Founder = {
  slug: string
  name: string
  roles: string[]
  image: string
}

/** TITA is founder-led; the studio page leads with the two of them. */
export const teamMembers: Founder[] = [
  {
    slug: 'ghazal-somaiya',
    name: 'Ghazal Somaiya',
    roles: ['Co-founder'],
    image: '/images/editorial/work_007.jpeg',
  },
  {
    slug: 'naamdasi-patel',
    name: 'Naamdasi Patel',
    roles: ['Co-founder'],
    image: '/images/editorial/work_010.jpeg',
  },
]

export type OfficeEntry = {
  members: string
  city: string
  url?: string
  label?: string
}

export const offices: OfficeEntry[] = OFFICES.map((o) => ({
  members: o.city.toUpperCase(),
  city: o.coords,
}))

/** The disciplines TITA composes with — its four pillars, expanded. */
export const network: string[] = [
  'Web Personalisation', 'UI/UX', 'Shopify', 'E-commerce', 'Email Marketing',
  'Automations', 'Chatbots', 'Social Media', 'Copywriting', 'Illustration',
  'Editing & Animation', 'Film Production', 'Product Photography',
  'Campaign Planning', 'Print, OOH', 'Rebranding', 'Media Planning',
  'Performance Marketing', 'Google Ads', 'You?',
]

export const history = [
  {
    year: 'MMXXI',
    title: 'Founded in Indore by Ghazal & Naamdasi',
    founders: SITE.founders as unknown as string[],
    body:
      'TITA was founded in Indore as a digital marketing agency built on a single conviction: that marketing is no longer made, it is composed. Ghazal and Naamdasi set out to work where art meets algorithm — pairing craft with measurement, so that neither has to apologise for the other.',
    image: '/images/editorial/process_001.jpeg',
    ratio: 67.1233,
  },
  {
    year: 'Now',
    title: 'And now in Ahmedabad',
    founders: ['Indore — 22.7196° N, 75.8577° E', 'Ahmedabad — 23.0225° N, 72.5714° E'],
    body:
      'Two cities. Two energies. One vision. The Ahmedabad studio extended the practice without diluting it — the same trinity of technology, brand and media, applied across a wider set of categories and a broader map.',
    image: '/images/editorial/process_002.jpeg',
    ratio: 153.876,
  },
]

export const studioGallery: string[] = [
  '/images/editorial/work_006.jpeg',
  '/images/editorial/work_010.jpeg',
  '/images/editorial/work_007.jpeg',
]
