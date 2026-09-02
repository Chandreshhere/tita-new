'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { TransitionLink } from '@/components/core/TransitionLink'
import { WorldClocks } from './WorldClocks'
import { NAV_PRIMARY, NAV_SECONDARY } from './nav-links'
import styles from './Header.module.scss'

type Props = {
  /** Rendered inside the fullscreen menu, where it is always fully visible. */
  variant?: 'page' | 'navigation'
  open?: boolean
  onToggle?: () => void
}

export function Header({ variant = 'page', open = false, onToggle }: Props) {
  const pathname = usePathname()
  const innerRef = useRef<HTMLDivElement>(null)

  // On the home page the nav is visible from the start; elsewhere it fades in
  // once the hero has settled, exactly as `is-index .c-Header-inner` does.
  useEffect(() => {
    if (variant !== 'page') return
    const inner = innerRef.current
    if (!inner || prefersReducedMotion()) return

    const tl = gsap.fromTo(
      inner,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.35 },
    )
    return () => {
      tl.kill()
    }
  }, [variant, pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const navList = (links: typeof NAV_PRIMARY, alt = false) => (
    <ul className={`${styles.nav} ${alt ? styles.navAlt : ''} t-list t-h6`}>
      {links.map((link) => (
        <li key={link.href}>
          <TransitionLink
            className={`${styles.navLink} ${isActive(link.href) ? styles.isActive : ''}`}
            href={link.href}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.label}
          </TransitionLink>
        </li>
      ))}
    </ul>
  )

  return (
    <header className={`${styles.root} ${variant === 'navigation' ? styles.inNav : ''}`}>
      <div className={`${styles.container} container`}>
        <div className={`${styles.content} row`}>
          <div className="col-6of24 col-sm-6of12">
            {/* The studio leads with its full name, not the TITA initialism. */}
            <TransitionLink className={styles.logo} href="/" aria-label="This Is That Agency, home">
              <span className={styles.wordmark}>This Is That Agency</span>
            </TransitionLink>
          </div>

          <div ref={innerRef} className={`${styles.inner} col-16of24 col-sm-12of12`}>
            <div className="row">
              <div className={`${styles.menu} col-10of16 col-sm-12of12`}>
                <div className="row">
                  <nav className="col-4of10 col-sm-12of12" aria-label="Main">
                    {navList(NAV_PRIMARY)}
                  </nav>
                  <nav className="col-4of10 offset-2of10 col-sm-12of12 offset-sm-0" aria-label="Secondary">
                    {navList(NAV_SECONDARY, true)}
                  </nav>
                </div>
              </div>

              <div className={`${styles.clocks} col-4of16 offset-2of16 col-sm-12of12 offset-sm-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.clocksImg} src="/images/ui/circles.svg" alt="" aria-hidden="true" />
                <WorldClocks />
              </div>
            </div>
          </div>

          {variant === 'page' && (
            <div className="col-2of24 col-sm-6of12">
              <button
                type="button"
                className={`${styles.burger} ${open ? styles.isOpen : ''} t-btn t-h6 t-h6--spacing`}
                onClick={onToggle}
                aria-expanded={open}
                aria-controls="main-navigation"
              >
                <span className={styles.burgerLabel}>{open ? 'Close' : 'Menu'}</span>
                <span className={styles.burgerIcon} aria-hidden="true">
                  <span className={styles.burgerLine} />
                  <span className={styles.burgerLine} />
                  <span className={styles.burgerLine} />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
