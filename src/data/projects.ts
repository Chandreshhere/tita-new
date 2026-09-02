/**
 * TITA's portfolio — the 26 brands the studio has worked with.
 *
 * The set and the spellings come from the supplied `website_project_thumbnails`
 * zip, which is the authoritative list: one numbered thumbnail per client,
 * matching one client mark in `/images/clients` exactly. (thisisthat.co.in/work
 * still lists an older, longer roster with some placeholder names — `Solar EV`
 * for Vayve Mobility, `Dream Villa Goa` for Go Goa Holiday Homes, `Trikaal` for
 * Hotel The Trikaay — so the zip wins wherever the two disagree.)
 *
 * `url` and `description` were researched from the open web. Five clients have
 * no `url` because their site could not be confirmed — see NEEDS CONFIRMATION
 * below; they render as a plain name rather than a link until we have one. One
 * more, Migo, is linked but flagged: the site found may not be the right Migo.
 *
 * NOTE: the files in `/images/clients` keep their original names even where
 * those disagree with the brand (`dream-villa-goa.png` is the Go Goa mark,
 * `evayve.png` is Vayve Mobility, `mittal-craftworks.png` is Mittal Group).
 * The mapping below is correct; the filenames are not worth churning while the
 * marks are being replaced anyway.
 */
export type Collection = 'Renaissance' | 'Amplify' | 'Compose' | 'Ignite' | 'Genesis'

export type Project = {
  slug: string
  /** Client name, as the brand writes it. */
  title: string
  /** The service tags shown under each card. */
  categories: string[]
  collection: Collection
  /** One line on who the client is. */
  description: string
  /** The client's own site. Absent where it could not be confirmed. */
  url?: string
  /** Client mark, on a dark field. */
  image?: string
  /** Project thumbnail, from the supplied zip. */
  thumbnail: string
}

/** Collection order as it appears in TITA's sticky filter rail. */
export const COLLECTIONS: Collection[] = [
  'Renaissance',
  'Amplify',
  'Compose',
  'Ignite',
  'Genesis',
]

/** Every discipline tag used across the portfolio, for the secondary filter. */
export const CATEGORIES: string[] = [
  'Brand Identity',
  'Packaging',
  'Campaign',
  'Art Direction',
  'Social Media',
  'Brand Strategy',
  'Web Design',
  'Web',
  'Content',
  'Event Branding',
  'Personal Branding',
]

const L = (f: string) => `/images/clients/${f}`
const T = (s: string) => `/images/projects/${s}.webp`

export const projects: Project[] = [
  // ── Renaissance ───────────────────────────────────────────────────────────
  {
    slug: 'kimirica-hunter',
    title: 'Kimirica Hunter',
    categories: ['Brand Identity', 'Campaign'],
    collection: 'Renaissance',
    description:
      'Indo-Canadian joint venture and India’s largest hotel amenities manufacturer, supplying Marriott, Hilton and Hyatt across 70+ countries from its Indore plant.',
    url: 'https://www.kimiricahunter.com',
    image: L('kimirica.svg'),
    thumbnail: T('kimirica-hunter'),
  },
  {
    slug: 'jagran-lakecity-university',
    title: 'Jagran Lakecity University',
    categories: ['Brand Strategy', 'Social Media'],
    collection: 'Renaissance',
    description:
      'Private university in Bhopal, established 2013, with 50+ programmes across management, law, science and journalism on a 40-acre campus.',
    url: 'https://jlu.edu.in',
    image: L('jlu.png'),
    thumbnail: T('jagran-lakecity-university'),
  },
  {
    slug: 'shrewsbury-international-school',
    title: 'Shrewsbury International School India',
    categories: ['Brand Identity', 'Campaign'],
    collection: 'Renaissance',
    description:
      'India’s largest co-ed British boarding school, opened in Bhopal in August 2025 on a 150-acre campus for Grades 6–12.',
    url: 'https://shrewsburyindia.in',
    image: L('shrewsbury.svg'),
    thumbnail: T('shrewsbury-international-school'),
  },
  {
    slug: 'bombay-hospital-indore',
    title: 'Bombay Hospital Indore',
    categories: ['Brand Identity', 'Web'],
    collection: 'Renaissance',
    description:
      'NABH-accredited 600-bed super-speciality tertiary referral hospital in Vijay Nagar, Indore, running since 2003.',
    url: 'https://www.bombayhospitalindore.com',
    image: L('bombay-hospital.png'),
    thumbnail: T('bombay-hospital-indore'),
  },
  {
    slug: 'isak',
    title: 'ISAK',
    categories: ['Brand Identity', 'Packaging'],
    collection: 'Renaissance',
    description:
      'Fine fragrance house with 170 years of Indian perfumery behind it — perfumes, attars and home scents. Named for “ishq”, and backed on Shark Tank India.',
    url: 'https://www.isakfragrances.com',
    image: L('isak.png'),
    thumbnail: T('isak'),
  },
  {
    slug: 'stone-galaxy',
    title: 'Stone Galaxy',
    categories: ['Web Design', 'Brand Identity'],
    collection: 'Renaissance',
    description:
      'Central India’s largest natural stone, tile and bathroom showroom, sourcing marble and granite direct from quarries in Italy, Turkey and Brazil.',
    url: 'https://www.stonegalaxy.co.in',
    image: L('stone-galaxy.png'),
    thumbnail: T('stone-galaxy'),
  },
  {
    slug: 'ozone-group',
    title: 'Ozone Group',
    categories: ['Campaign', 'Art Direction'],
    collection: 'Renaissance',
    // NEEDS CONFIRMATION — two unrelated Ozones fit the green-building mark:
    // ozonegroup.com (Bengaluru property developer) and ozoneindiagroup.com
    // (Ahmedabad industrial/commercial developer).
    description:
      'Property developer, working across residential, commercial and business-park projects.',
    image: L('ozone-group.png'),
    thumbnail: T('ozone-group'),
  },
  {
    slug: 'skyra',
    title: 'Skyra',
    categories: ['Social Media', 'Content'],
    collection: 'Renaissance',
    // NEEDS CONFIRMATION — no matching company found online.
    description:
      'Education brand — “learn today, lead tomorrow”.',
    image: L('skyra.webp'),
    thumbnail: T('skyra'),
  },
  {
    slug: 'go-goa-holiday-homes',
    title: 'Go Goa Holiday Homes',
    categories: ['Web Design', 'Brand Identity'],
    collection: 'Renaissance',
    // NEEDS CONFIRMATION — no site found under this exact name.
    description: 'Holiday villa and homestay rentals in Goa.',
    image: L('dream-villa-goa.png'),
    thumbnail: T('go-goa-holiday-homes'),
  },

  // ── Amplify ───────────────────────────────────────────────────────────────
  {
    slug: 'fayon-kids',
    title: 'Fayon Kids',
    categories: ['Social Media', 'Art Direction'],
    collection: 'Amplify',
    description:
      'Premium kidswear label founded by Preeti Jatia in 2006 — Fayon Luxe, Prêt and Label — dressing newborns to teenagers for weddings and festivals.',
    url: 'https://www.fayonkids.com',
    image: L('fayon-kids.png'),
    thumbnail: T('fayon-kids'),
  },
  {
    slug: 'vayve-mobility',
    title: 'Vayve Mobility',
    categories: ['Brand Identity', 'Web Design'],
    collection: 'Amplify',
    description:
      'Pune EV maker behind Eva, India’s first solar-powered car — a solar roof adding up to 3,000 km of free range a year, from ₹3.25 lakh.',
    url: 'https://evayve.com',
    image: L('evayve.png'),
    thumbnail: T('vayve-mobility'),
  },
  {
    slug: 'denz',
    title: 'DenZ',
    categories: ['Social Media', 'Art Direction'],
    collection: 'Amplify',
    description:
      'Slow-fashion denim label for women — jeans, jackets and co-ords made to last, stocked at Broadway.shopp in Pune.',
    url: 'https://www.denzlabel.com',
    image: L('denz-label.webp'),
    thumbnail: T('denz'),
  },
  {
    slug: 'biocule',
    title: 'Biocule',
    categories: ['Brand Identity', 'Web'],
    collection: 'Amplify',
    description:
      'Gurugram skincare brand founded in 2021 — “beauty from nature, with science” — serums, toners and face washes formulated for specific concerns.',
    url: 'https://biocule.com',
    image: L('biocule.png'),
    thumbnail: T('biocule'),
  },

  // ── Compose ───────────────────────────────────────────────────────────────
  {
    slug: 'migo',
    title: 'Migo',
    categories: ['Brand Identity', 'Social Media'],
    collection: 'Compose',
    // NEEDS CONFIRMATION — thehouseofmigo.com is a women's jewellery label,
    // but the thumbnail is styled as bath and body. Same brand, or two Migos?
    description:
      'The House of Migo — designer label blending traditional Indian artistry with contemporary design.',
    url: 'https://www.thehouseofmigo.com',
    image: L('house-of-migo.jpg'),
    thumbnail: T('migo'),
  },
  {
    slug: 'the-posh',
    title: 'The Posh',
    categories: ['Art Direction', 'Packaging'],
    collection: 'Compose',
    description:
      'Tableware and home décor label — handmade, food-safe collections of plates, servers and coasters.',
    url: 'https://theposh.in',
    image: L('theposh.webp'),
    thumbnail: T('the-posh'),
  },
  {
    slug: 'madhuri-cooking-oil',
    title: 'Madhuri Cooking Oil',
    categories: ['Campaign', 'Social Media'],
    collection: 'Compose',
    description:
      'Indore edible-oil maker since 1992 — soybean, sunflower and mustard oils distributed across Madhya Pradesh and Chhattisgarh.',
    url: 'https://madhurioils.com',
    image: L('madhuri-oil.png'),
    thumbnail: T('madhuri-cooking-oil'),
  },
  {
    slug: 'trikaay',
    title: 'Hotel The Trikaay',
    categories: ['Brand Identity', 'Social Media'],
    collection: 'Compose',
    description:
      'Three-star business and leisure hotel behind the High Court in South Tukoganj, Indore, known for its vegetarian kitchen.',
    url: 'https://trikaay.in',
    image: L('trikaay.png'),
    thumbnail: T('trikaay'),
  },
  {
    slug: 'roccia',
    title: 'Roccia',
    categories: ['Art Direction', 'Content'],
    collection: 'Compose',
    description:
      'Marble decor and artistry — handcrafted stone surfaces and decorative pieces for interiors.',
    url: 'https://roccia.in',
    image: L('roccia.png'),
    thumbnail: T('roccia'),
  },

  // ── Ignite ────────────────────────────────────────────────────────────────
  {
    slug: 'mu20',
    title: 'MU20 School of Opportunity',
    categories: ['Brand Strategy', 'Social Media'],
    collection: 'Ignite',
    description:
      'Indore-based school of opportunity building experiential learning for high schoolers, and the team that brought the OxfordMUN legacy to India.',
    url: 'https://www.mu20.co',
    image: L('mu20.png'),
    thumbnail: T('mu20'),
  },
  {
    slug: 'madanlal-chhaganlal',
    title: 'Jewellers Madanlal Chhaganlal',
    categories: ['Brand Identity', 'Packaging'],
    collection: 'Ignite',
    description:
      'JMC — third-generation family jewellers on MG Road, Indore, run by the Nagar family since the 1940s.',
    url: 'https://madanlalchhaganlal.com',
    image: L('madanlal.png'),
    thumbnail: T('madanlal-chhaganlal'),
  },
  {
    slug: 'harshvardhan-ishipal',
    title: 'Harshvardhan Ishipal',
    categories: ['Brand Identity', 'Content'],
    collection: 'Ignite',
    description:
      'HI Diamonds — exquisite diamond jewellery at Geeta Bhawan Circle, Indore, specialising in jadau, royal pieces and solitaires.',
    url: 'https://harshvardhanishipal.com',
    image: L('harshvardhan.jpg'),
    thumbnail: T('harshvardhan-ishipal'),
  },
  {
    slug: 'mittal-group',
    title: 'Mittal Group',
    categories: ['Brand Identity', 'Web Design'],
    collection: 'Ignite',
    description:
      'Founded 1907 and six generations on, India’s largest maker of coin blanks, cases, medals, foils and craftworks — and the main coin-blank supplier to the Government Mints.',
    url: 'https://mittalgroup.com',
    image: L('mittal-craftworks.png'),
    thumbnail: T('mittal-group'),
  },
  {
    slug: 'abhyuday',
    title: 'Abhyuday',
    categories: ['Campaign', 'Social Media'],
    collection: 'Ignite',
    // NEEDS CONFIRMATION — several Indore institutes share the name.
    description: 'Education and skill-development institute.',
    image: L('abhyuday.png'),
    thumbnail: T('abhyuday'),
  },

  // ── Genesis ───────────────────────────────────────────────────────────────
  {
    slug: 'akash-hospital',
    title: 'Akash Hospital',
    categories: ['Brand Identity', 'Web'],
    collection: 'Genesis',
    // NEEDS CONFIRMATION — several hospitals share the name; no city given.
    description: 'Multi-speciality hospital.',
    image: L('akash-hospital.png'),
    thumbnail: T('akash-hospital'),
  },
  {
    slug: 'sovi-tydi-bowl',
    title: 'SOVI & TYDI Bowl',
    categories: ['Brand Identity', 'Packaging'],
    collection: 'Genesis',
    description:
      'India’s first vinegar and baking-soda powered cleaning range, from Mumbai’s Raaso Cleaning — SOVI for floors and dishes, TYDI Bowl for toilets.',
    url: 'https://soviandtydi.com',
    image: L('soviandtydi.png'),
    thumbnail: T('sovi-tydi-bowl'),
  },
  {
    slug: 'teethhub',
    title: 'TeethHub',
    categories: ['Brand Identity', 'Social Media'],
    collection: 'Genesis',
    description:
      'Dental clinic in New Palasia, Indore, led by Dr Neetu Shah — implants, cosmetic dentistry and children’s dentistry.',
    url: 'https://teethhub.in',
    image: L('teethhub.webp'),
    thumbnail: T('teethhub'),
  },
]

/** The four projects the home page cycles through in its pinned stack. */
export const homeProjects: Project[] = [
  'kimirica-hunter',
  'shrewsbury-international-school',
  'bombay-hospital-indore',
  'fayon-kids',
].map((slug) => projects.find((p) => p.slug === slug)!)

/**
 * The six shown in the Services page work grid — one from each collection plus
 * a second Renaissance piece, so the strip reads as a cross-section of the
 * portfolio rather than a single vertical. These render as project photography
 * (`thumbnail`), not as client marks.
 */
export const servicesProjects: Project[] = [
  'kimirica-hunter',
  'ozone-group',
  'isak',
  'fayon-kids',
  'roccia',
  'mu20',
].map((slug) => projects.find((p) => p.slug === slug)!)
