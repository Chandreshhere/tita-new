export type NavLink = { label: string; href: string; external?: boolean }

/**
 * TITA's own navigation: Home · Service · Portfolio · Contact.
 * Routes keep the existing paths; only the labels are the studio's.
 */
export const NAV_PRIMARY: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Service', href: '/services' },
]

export const NAV_SECONDARY: NavLink[] = [
  { label: 'Portfolio', href: '/work' },
  { label: 'Contact', href: '/contact' },
]

export const NAV_FOOTER: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Service', href: '/services' },
  { label: 'Portfolio', href: '/work' },
  { label: 'Studio', href: '/team' },
  { label: 'Contact', href: '/contact' },
]

export const SOCIALS: NavLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/this-is-that-agency', external: true },
  { label: 'Instagram', href: 'https://www.instagram.com/thisisthatagency', external: true },
]

/** TITA has no sister offices to link out to — these are its own coordinates. */
export const EXTERNAL_OFFICES: NavLink[] = [
  { label: 'Indore — 22.7196° N', href: 'https://maps.google.com/?q=22.7196,75.8577', external: true },
  { label: 'Ahmedabad — 23.0225° N', href: 'https://maps.google.com/?q=23.0225,72.5714', external: true },
]
