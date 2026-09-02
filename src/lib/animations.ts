import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

/**
 * Reusable GSAP recipes. Every helper returns something disposable so callers
 * can revert cleanly on unmount — the reference site's animations are long-lived
 * and leaking ScrollTriggers is what kills a page like this.
 */

type El = Element | null | undefined

/** Split an element's text into per-line spans, ready to be masked and revealed. */
export function splitLines(el: HTMLElement): HTMLElement[] {
  const lines = Array.from(el.querySelectorAll<HTMLElement>('[data-line]'))
  return lines.length ? lines : [el]
}

/**
 * The site's signature heading reveal: each line rises out of its own mask.
 * `yPercent: 100 → 0` with the inner wrapper hidden by `overflow: hidden`.
 */
export function createTextReveal(
  target: El,
  opts: { delay?: number; stagger?: number; scroll?: boolean; duration?: number } = {},
) {
  if (!target) return
  const el = target as HTMLElement
  const lines = splitLines(el)
  const { delay = 0, stagger = 0.08, scroll = true, duration = 1.1 } = opts

  if (prefersReducedMotion()) {
    gsap.set(lines, { yPercent: 0, opacity: 1 })
    return
  }

  const tween = gsap.fromTo(
    lines,
    { yPercent: 105, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      paused: scroll,
      ...(scroll
        ? {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        : {}),
    },
  )
  return tween
}

/** Soft fade + rise, used for metadata, paragraphs and list rows. */
export function createFadeReveal(
  targets: El | El[] | NodeListOf<Element>,
  opts: { y?: number; stagger?: number; delay?: number; trigger?: El; start?: string } = {},
) {
  const { y = 30, stagger = 0.06, delay = 0, trigger, start = 'top 88%' } = opts
  if (!targets) return

  if (prefersReducedMotion()) {
    gsap.set(targets as gsap.TweenTarget, { y: 0, opacity: 1 })
    return
  }

  return gsap.fromTo(
    targets as gsap.TweenTarget,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: (trigger as Element) ?? (targets as Element),
        start,
        once: true,
      },
    },
  )
}

/** Scale-from-inside image reveal (the CircleMask companion for plain images). */
export function createImageReveal(target: El, opts: { scale?: number } = {}) {
  if (!target || prefersReducedMotion()) return
  const { scale = 1.15 } = opts
  return gsap.fromTo(
    target as HTMLElement,
    { scale, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: target as Element, start: 'top 90%', once: true },
    },
  )
}

/**
 * Scrub-linked parallax (`c-ParallaxObject`). `speed` is the fraction of the
 * element's own travel it lags behind by — the reference keeps this subtle.
 */
export function createParallax(
  target: El,
  opts: { speed?: number; scale?: number } = {},
) {
  if (!target || prefersReducedMotion()) return
  const { speed = 0.12, scale } = opts
  const el = target as HTMLElement

  return gsap.fromTo(
    el,
    { y: () => window.innerHeight * speed },
    {
      y: () => -window.innerHeight * speed,
      ...(scale ? { scale } : {}),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  )
}

/** Horizontal marquee tied to scroll — the `new york ↔ london ↔ tokyo` band. */
export function createHorizontalMovement(target: El, distance = 300) {
  if (!target) return
  const el = target as HTMLElement
  if (prefersReducedMotion()) return

  return gsap.fromTo(
    el,
    { x: distance },
    {
      x: -distance,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  )
}

/**
 * Pointer-following hover for project tiles. Uses `quickTo` so the pointer path
 * never touches React state.
 */
export function createProjectHover(
  root: HTMLElement,
  inner: HTMLElement,
  opts: { strength?: number; scale?: number } = {},
) {
  const { strength = 14, scale = 1.03 } = opts
  if (prefersReducedMotion()) return () => {}

  const xTo = gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3.out' })
  const yTo = gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3.out' })
  const sTo = gsap.quickTo(inner, 'scale', { duration: 0.8, ease: 'power3.out' })

  const onMove = (e: PointerEvent) => {
    const r = root.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height
    xTo(dx * strength)
    yTo(dy * strength)
  }
  const onEnter = () => sTo(scale)
  const onLeave = () => {
    xTo(0)
    yTo(0)
    sTo(1)
  }

  root.addEventListener('pointermove', onMove)
  root.addEventListener('pointerenter', onEnter)
  root.addEventListener('pointerleave', onLeave)

  return () => {
    root.removeEventListener('pointermove', onMove)
    root.removeEventListener('pointerenter', onEnter)
    root.removeEventListener('pointerleave', onLeave)
  }
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}
