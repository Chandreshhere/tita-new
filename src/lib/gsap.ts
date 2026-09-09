import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // Lenis drives the scroll position; ScrollTrigger must not also try to.
  ScrollTrigger.defaults({ markers: false })
}

export { gsap, ScrollTrigger }

/** The easing curves used across the site. */
export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  /** cubic-bezier(.165,.84,.44,1) — the default transition curve. */
  standard: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
} as const

export const CUBIC_OUT = [0.165, 0.84, 0.44, 1] as const
