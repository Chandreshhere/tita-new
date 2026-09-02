'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { useSmoothScroll } from '@/components/core/SmoothScrollProvider'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import { EXTERNAL_OFFICES, NAV_FOOTER, SOCIALS } from '@/components/navigation/nav-links'
import { SITE, OFFICES } from '@/data/site'
import styles from './Footer.module.scss'

/**
 * The closing CTA. The inner block is a `c-ParallaxObject`: it sits
 * inside an `overflow: hidden` shell and slides up as the footer scrolls into
 * view, so the content appears to be revealed from behind the page above it.
 */
export function Footer() {
  const rootRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const inner = innerRef.current
    if (!root || !inner || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -18 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      gsap.fromTo(
        root.querySelectorAll('[data-footer-reveal]'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  const { scrollTo } = useSmoothScroll()

  return (
    <footer ref={rootRef} className={`${styles.root} container`}>
      <div ref={innerRef} className={styles.inner}>
        <div className={`${styles.head} row`}>
          <div className="col-9of24 offset-1of24 offset-md-0 col-sm-12of12 offset-sm-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.circles}
              src="/images/ui/circles.svg"
              alt=""
              aria-hidden="true"
              data-footer-reveal
            />
            <h2 className={`${styles.title} t-h2`} data-footer-reveal>
              <MonopoText>Ready to compose your renaissance?</MonopoText>
            </h2>
          </div>
        </div>

        <div className="row">
          <div className="col-7of24 offset-1of24 col-md-7of24 offset-md-0 col-sm-12of12 offset-sm-0">
            <div className="row">
              <div className="col-5of7 col-md-24of24 col-sm-7of12">
                <div className={`t-text t-wysiwyg ${styles.gray}`} data-footer-reveal>
                  <p>
                    Have an idea in mind? Let&rsquo;s connect and explore how we can help
                    bring it to life. Rebirth is not optional. It is inevitable.
                  </p>
                </div>
              </div>
            </div>
            <a
              className={`${styles.contact} t-link t-h5`}
              href={`mailto:${SITE.email}`}
              data-footer-reveal
            >
              {SITE.email}
              <span className={styles.contactIcon} aria-hidden="true"> →</span>
            </a>
          </div>

          <div className="col-11of24 offset-4of24 col-md-15of24 offset-md-2of24 col-sm-12of12 offset-sm-0">
            <div className="row">
              <div className={`${styles.column} col-3of11 col-md-5of15 col-sm-12of12`} data-footer-reveal>
                <h3 className={`${styles.subtitle} t-h6`}>Our Studios</h3>
                <address className="t-address">
                  <div className={`t-text t-wysiwyg ${styles.gray}`}>
                    <p>
                      {OFFICES.map((o) => (
                        <span key={o.city}>
                          {o.city.toUpperCase()}<br />
                          {o.coords}<br />
                          <br />
                        </span>
                      ))}
                      Founded by {SITE.founders.join(' & ')}<br />
                      {SITE.founded}
                    </p>
                  </div>
                </address>
                <a className={`${styles.socialsLink} t-text`} href={SITE.phoneHref}>
                  {SITE.phone}
                </a>
              </div>

              <div
                className={`${styles.column} col-3of11 offset-1of11 col-md-4of15 offset-md-1of15 col-sm-12of12 offset-sm-0`}
                data-footer-reveal
              >
                <h3 className={`${styles.subtitle} t-h6`}>Follow us</h3>
                <ul className={`${styles.socials} t-list t-text`}>
                  {SOCIALS.map((s) => (
                    <li key={s.href}>
                      <a
                        className={styles.socialsLink}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className={`${styles.externals} t-list`}>
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

              <div
                className={`${styles.column} col-3of11 offset-1of11 col-md-4of15 offset-md-1of15 col-sm-12of12 offset-sm-0`}
                data-footer-reveal
              >
                <nav aria-label="Footer">
                  <ul className={`${styles.nav} t-list t-h6`}>
                    {NAV_FOOTER.map((link) => (
                      <li key={link.href}>
                        <TransitionLink className={styles.navLink} href={link.href}>
                          {link.label}
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.foot} row`}>
          <div className={`${styles.footInner} col-22of24 offset-1of24 col-md-24of24 offset-md-0 col-sm-12of12 offset-sm-0`}>
            <span className={`t-text--sm ${styles.gray}`}>
              © TITA {new Date().getFullYear()} &middot; {SITE.tagline} &middot; All rights reserved
            </span>
            <button
              type="button"
              className={`${styles.top} t-text--sm t-btn`}
              onClick={() => scrollTo(0)}
            >
              top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
