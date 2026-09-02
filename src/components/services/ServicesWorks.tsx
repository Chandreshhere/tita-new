'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { servicesProjects } from '@/data/projects'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './ServicesWorks.module.scss'

/**
 * "Selected work" — six pieces of the portfolio, shown as the project
 * photography from `/images/projects`.
 *
 * This used to be a Swiper carrying the clients' logo marks on grey tiles: with
 * three slides and `slidesPerView: 3` it was a grid pretending to be a slider,
 * and the tiles showed a mark rather than any work. It is a plain grid now, and
 * it shows the work itself — the same treatment the home page's project section
 * uses.
 */
export function ServicesWorks() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createFadeReveal(root.querySelectorAll('[data-reveal]'), {
        trigger: root,
        stagger: 0.07,
        y: 40,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className={`${styles.head} row middle`}>
        <div className="col-16of24 col-sm-12of12">
          <p className={`${styles.eyebrow} t-text--sm`}>What we could compose together</p>
          <h2 className="t-h2 t-h2--display">
            <MonopoText>Selected work</MonopoText>
          </h2>
        </div>
        <div className={`${styles.headRight} col-8of24 col-sm-12of12`}>
          <TransitionLink className="t-btn-primary" href="/work" data-cursor="discover">
            <span>View portfolio</span>
            <span className="t-btn-primary-arrow" aria-hidden="true">→</span>
          </TransitionLink>
        </div>
      </div>

      <ul className={`${styles.grid} t-list`}>
        {servicesProjects.map((project) => (
          <li className={styles.cell} key={project.slug} data-reveal>
            <TransitionLink
              className={styles.item}
              href={`/work/${project.slug}`}
              data-cursor="case"
            >
              <div className={styles.imgWrap}>
                <Image
                  className={styles.img}
                  src={project.thumbnail}
                  alt={project.title}
                  width={1200}
                  height={900}
                  sizes="(max-width: 767px) 92vw, (max-width: 979px) 46vw, 30vw"
                />
              </div>
              <div className={styles.info}>
                <ul className={`${styles.categories} t-list t-h6 t-h6--spacing`}>
                  {project.categories.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <h3 className={`${styles.itemTitle} t-h4 t-h4--display`}>
                  <MonopoText>{project.title}</MonopoText>
                </h3>
              </div>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
