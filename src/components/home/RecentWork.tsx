'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { homeProjects } from '@/data/projects'
import { HOME_GRADIENT, PROJECT_GRADIENTS } from '@/data/gradients'
import { useHomeGradient } from './HomeGradientContext'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import { Ruler } from '@/components/ui/Ruler'
import { ClientMark } from '@/components/work/ClientMark'
import styles from './RecentWork.module.scss'

/**
 * `c-Home-sticky` — the pinned "Recent work" stack.
 *
 * Pinned for one viewport per project. Scroll progress drives three things at
 * once, all measured off the reference:
 *
 * - **The images run as a vertical drum.** Every project image is stacked in one
 *   fixed frame and the whole column is translated by `-index * 100%`, so the
 *   outgoing image slides up and out while the incoming slides in beneath it —
 *   both visible at once through the same window. It is not a crossfade.
 * - **The background palette becomes the project's own.** Each project carries
 *   its own gradient config in the CMS, and the page background morphs into it
 *   as that project becomes active.
 * - The title column slides prev → active → next and the ruler tracks progress.
 */
export function RecentWork() {
  const rootRef = useRef<HTMLDivElement>(null)
  const drumRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  // The stack only owns the background palette while it is actually on screen —
  // above it, the hero's own palette stands.
  const [inView, setInView] = useState(false)
  const { setPalette } = useHomeGradient()

  const total = homeProjects.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * total}`,
        pin: root.querySelector<HTMLElement>(`.${styles.sticky}`),
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => setInView(self.isActive),
        onUpdate: (self) => {
          setProgress(self.progress)

          // The drum position is continuous, not stepped — it tracks scroll
          // directly so the two adjacent images are both visible mid-move.
          const exact = self.progress * (total - 1)
          if (drumRef.current) {
            gsap.set(drumRef.current, { yPercent: -exact * 100 })
          }

          const index = Math.round(exact)
          setActive((prev) => (prev === index ? prev : index))
        },
      })
    }, root)

    return () => ctx.revert()
  }, [total])

  // Morph the page background into the active project's own palette. Leaving
  // the stack at either end returns it to the hero's.
  useEffect(() => {
    if (!inView) {
      setPalette(HOME_GRADIENT, 1.1)
      return
    }
    const project = homeProjects[active]
    setPalette(PROJECT_GRADIENTS[project.slug] ?? HOME_GRADIENT, 1.1)
  }, [active, inView, setPalette])

  const activeProject = homeProjects[active]

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ height: `${total * 100}vh` }}
    >
      <div className={styles.sticky}>
        <div className={styles.images}>
          <div className="container">
            <div className="row">
              <div className="col-13of24 offset-6of24 col-sm-12of12 offset-sm-0">
                {/* Fixed window; the drum inside it slides vertically. */}
                <div className={styles.frame}>
                  <div ref={drumRef} className={styles.drum}>
                    {homeProjects.map((project, i) => (
                      <TransitionLink
                        key={project.slug}
                        className={styles.slide}
                        href={`/work/${project.slug}`}
                        data-cursor="project"
                        tabIndex={i === active ? 0 : -1}
                        aria-hidden={i === active ? undefined : true}
                      >
                        <ClientMark
                          className={styles.mark}
                          src={project.image}
                          name={project.title}
                          eager={i === 0}
                        />
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.info} container`}>
          <div className="row">
            <div className={`${styles.rulerCol} col-1of24 offset-2of24`}>
              <Ruler cm={4} mm={9} progress={progress} />
            </div>

            <div className="col-9of24 col-sm-12of12">
              <div className={`${styles.legend} t-text--sm`}>Selected work</div>

              <div className={styles.titles}>
                {homeProjects.map((project, i) => (
                  <div
                    key={project.slug}
                    className={`${styles.titlesItem} ${
                      i === active ? styles.isActive : i < active ? styles.isPrev : styles.isNext
                    }`}
                    aria-hidden={i === active ? undefined : true}
                  >
                    <h2 className={`${styles.title} t-h3`}>
                      <MonopoText>{project.title}</MonopoText>
                    </h2>
                    <ul className={`${styles.categories} t-list t-h6 t-h6--spacing`}>
                      {project.categories.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.link} col-7of24 offset-3of24`}>
              <TransitionLink
                className="t-link-primary"
                href={`/work/${activeProject.slug}`}
                aria-label={`View project: ${activeProject.title}`}
              >
                <span className="t-link-primary-icon" aria-hidden="true" />
              </TransitionLink>
            </div>
          </div>
        </div>

        <TransitionLink
          className={`${styles.btn} t-btn-primary`}
          href="/work"
          data-cursor="discover"
        >
          <span>View portfolio</span>
          <span className="t-btn-primary-arrow" aria-hidden="true">→</span>
        </TransitionLink>
      </div>
    </div>
  )
}
