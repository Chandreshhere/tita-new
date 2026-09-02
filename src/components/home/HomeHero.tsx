'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { HOME_GRADIENT } from '@/data/gradients'
import { MonopoGradient } from '@/components/webgl/MonopoGradient'
import { useHomeGradient } from './HomeGradientContext'
import { MonopoText } from '@/components/ui/MonopoText'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { HeroLens } from './HeroLens'
import styles from './HomeHero.module.scss'

/**
 * TITA's opening line, from thisisthat.co.in. `alt` is what the hero lens
 * reveals under the cursor — the studio's own name and line, in English.
 */
const TITLE_LINES = [
  { en: 'Marketing is no', alt: 'This Is That' },
  { en: 'longer made.',    alt: 'Agency' },
  { en: 'It is composed.', alt: 'Indore & Ahmedabad' },
]

const FOOT_ITEMS = [
  { strong: 'Born in Indore', sub: 'Now in Ahmedabad' },
  { strong: 'Art. Intelligence.', sub: 'Impact.' },
  { strong: 'Technology, brand', sub: 'and media' },
]

/**
 * The home hero: TITA's proposition set over the procedural gradient, with the
 * lens overlaid on top.
 *
 * The headline is real DOM text — the canvas copy takes over only once it is
 * confirmed drawing, so the words stay selectable, translatable and readable by
 * assistive tech regardless of WebGL.
 */
export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null)
  const { register } = useHomeGradient()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const lines = root.querySelectorAll('[data-line]')
    const foot = root.querySelector('[data-foot]')

    if (prefersReducedMotion()) {
      gsap.set([lines, foot], { yPercent: 0, opacity: 1, clearProps: 'transform' })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35 })

      tl.fromTo(
        lines,
        { yPercent: 125, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.09, ease: 'power3.out' },
      ).fromTo(
        foot,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.1, ease: 'power3.out' },
        '-=0.8',
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={styles.root}>
      {/* One fixed gradient layer for the whole page — the project stack below
          morphs its palette rather than mounting a second context. */}
      <MonopoGradient
        className={styles.gradient}
        config={HOME_GRADIENT}
        onReady={register}
      />

      <div className={`${styles.inner} container`}>
        <h1 className={`${styles.title} t-h1`} id="home-headline">
          {TITLE_LINES.map((line, i) => (
            <span className={`${styles.line} ${styles[`line${i}`]}`} key={line.en}>
              <span data-line>
                <MonopoText>{line.en}</MonopoText>
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* Canvas copy of the headline plus the magnifying bubble that reveals the
          studio's name. Takes over from the DOM text only once it is drawing. */}
      <HeroLens lines={TITLE_LINES} titleSelector="#home-headline" />

      <div className={styles.footWrap}>
        <div className="container">
          <div className={styles.foot} data-foot>
            <div className="row bottom">
              <div className={`${styles.circles} col-6of24`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/ui/circles.svg" alt="" aria-hidden="true" />
              </div>

              <div className="col-16of24 col-sm-10of12">
                <div className="row">
                  {FOOT_ITEMS.map((item, i) => (
                    <div
                      className={`${styles.item} t-text--lg col-4of16 col-sm-10of10 ${
                        i > 0 ? 'offset-2of16' : ''
                      }`}
                      key={item.strong}
                    >
                      <strong>{item.strong}</strong>
                      <span className={styles.itemSub}>{item.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-2of24 col-sm-2of12">
                <ScrollCue className={styles.scroll} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
