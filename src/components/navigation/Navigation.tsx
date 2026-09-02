'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { useSmoothScroll } from '@/components/core/SmoothScrollProvider'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import { WorldClocks } from './WorldClocks'
import { Header } from './Header'
import { EXTERNAL_OFFICES, NAV_PRIMARY, NAV_SECONDARY, SOCIALS } from './nav-links'
import styles from './Navigation.module.scss'

const MENU_LINKS = [...NAV_PRIMARY, ...NAV_SECONDARY]

/**
 * `c-Navigation` — the fullscreen menu.
 *
 * The panel wipes down from the top on desktop and in from the right on mobile,
 * with the links staggering in behind it. Scroll is locked while it's open and
 * focus is trapped inside the panel.
 */
export function Navigation() {
  const [open, setOpen] = useState(false)
  // `c-Navigation.is-visible` — the floating burger appears once the hero has
  // scrolled away, and stays up while the menu is open so it doubles as close.
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { stop, start } = useSmoothScroll()

  const panelRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const asideRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])

  // Any route change closes the menu — the link click itself starts the
  // transition, so the panel should be out of the way by the time it lands.
  useEffect(() => {
    setOpen(false)
    setScrolled(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    const bg = bgRef.current
    if (!panel || !bg) return

    const items = listRef.current?.querySelectorAll('li') ?? []
    const reduced = prefersReducedMotion()

    // Desktop wipes down from the top; mobile slides in from the right.
    const axis: 'xPercent' | 'yPercent' = window.matchMedia('(max-width: 767px)').matches
      ? 'xPercent'
      : 'yPercent'
    const hidden = { [axis]: axis === 'xPercent' ? 100 : -100 }
    const shown = { [axis]: 0 }

    tlRef.current?.kill()

    if (open) {
      lastFocused.current = document.activeElement as HTMLElement
      stop()

      const tl = gsap.timeline()
      tlRef.current = tl

      if (reduced) {
        gsap.set(panel, { visibility: 'visible', ...shown })
        gsap.set(bg, { autoAlpha: 1 })
        gsap.set([items, asideRef.current], { autoAlpha: 1, y: 0 })
      } else {
        tl.set(panel, { visibility: 'visible' })
          .to(bg, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
          .fromTo(
            panel,
            hidden,
            { ...shown, duration: 0.8, ease: 'power3.inOut' },
            0,
          )
          .fromTo(
            items,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' },
            0.35,
          )
          .fromTo(
            asideRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            0.55,
          )
      }

      // Move focus into the panel for keyboard users.
      requestAnimationFrame(() => {
        panel.querySelector<HTMLElement>('a, button')?.focus()
      })
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { visibility: 'hidden' })
          start()
        },
      })
      tlRef.current = tl

      if (reduced) {
        gsap.set(panel, { visibility: 'hidden', ...hidden })
        gsap.set(bg, { autoAlpha: 0 })
        start()
      } else {
        tl.to(panel, { ...hidden, duration: 0.6, ease: 'power3.inOut' })
          .to(bg, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0)
      }

      lastFocused.current?.focus?.()
    }

    return () => {
      tlRef.current?.kill()
    }
  }, [open, start, stop])

  // Escape closes; Tab is trapped inside the open panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <>
      <Header open={open} onToggle={toggle} />

      <div className={styles.root}>
        <div
          ref={bgRef}
          className={styles.bg}
          onClick={close}
          aria-hidden="true"
        />

        <div
          ref={panelRef}
          id="main-navigation"
          className={styles.content}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          inert={!open}
        >
          <Header variant="navigation" />

          <div className={`${styles.body} container`}>
            <div className="row">
              <nav className="col-14of24 col-sm-12of12" aria-label="Menu">
                <ul ref={listRef} className={`${styles.list} t-list`}>
                  {MENU_LINKS.map((link) => (
                    <li key={link.href}>
                      <TransitionLink
                        className={`${styles.link} t-h1`}
                        href={link.href}
                        data-cursor="discover"
                      >
                        <span className={styles.linkInner}>
                          <MonopoText>{link.label}</MonopoText>
                        </span>
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div
                ref={asideRef}
                className={`${styles.aside} col-8of24 offset-2of24 col-sm-12of12 offset-sm-0`}
              >
                <div className={styles.asideBlock}>
                  <h2 className={`${styles.asideTitle} t-h6`}>Follow us</h2>
                  <ul className="t-list t-text">
                    {SOCIALS.map((s) => (
                      <li key={s.href}>
                        <a
                          className={styles.asideLink}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.asideBlock}>
                  <h2 className={`${styles.asideTitle} t-h6`}>Monopo worldwide</h2>
                  <ul className="t-list">
                    {EXTERNAL_OFFICES.map((o) => (
                      <li key={o.href}>
                        <a
                          className="t-link-tertiary"
                          href={o.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="t-link-tertiary-icon">↗</span>
                          <span className="t-link-tertiary-label">{o.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.asideBlock}>
                  <h2 className={`${styles.asideTitle} t-h6`}>Local time</h2>
                  <WorldClocks />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* `c-Navigation-burger` — floats above the panel so it can close it. */}
        <button
          type="button"
          className={`${styles.burger} ${scrolled || open ? styles.isVisible : ''} ${
            open ? styles.isOpen : ''
          } t-btn`}
          onClick={toggle}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          <span className="u-visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={styles.burgerIcon} aria-hidden="true">
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </span>
        </button>
      </div>
    </>
  )
}
