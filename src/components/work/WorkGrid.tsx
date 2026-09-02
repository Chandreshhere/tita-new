'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { projects } from '@/data/projects'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import { Ruler } from '@/components/ui/Ruler'
import { ClientMark } from './ClientMark'
import styles from './WorkGrid.module.scss'

/**
 * The portfolio grid, with the measurement rail down its left margin.
 *
 * The rail's collection labels (All · Renaissance · Amplify · Compose · Ignite ·
 * Genesis) and the mobile select that mirrored them are gone; the ruler they
 * sat under stays, and still tracks how far through the grid you have scrolled.
 *
 * Items alternate between the two 8-of-18 columns and every other one carries a
 * parallax offset, which is what gives the grid its staggered, non-gridlike
 * rhythm.
 */
export function WorkGrid() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  // The rail's ruler mirrors how far through the grid you've scrolled.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: grid,
        start: 'top center',
        end: 'bottom bottom',
        onUpdate: (self) => setProgress(self.progress),
        invalidateOnRefresh: true,
      })
    }, grid)
    return () => ctx.revert()
  }, [])

  // Entrance for the grid.
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const items = grid.querySelectorAll<HTMLElement>(`.${styles.item}`)
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.05,
          ease: 'power3.out',
          overwrite: true,
        },
      )

      // Parallax the odd column so the two tracks drift against each other.
      items.forEach((item, i) => {
        if (i % 2 === 0) return
        gsap.fromTo(
          item.querySelector(`.${styles.parallax}`),
          { y: 60 },
          {
            y: -60,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      ScrollTrigger.refresh()
    }, grid)

    return () => ctx.revert()
  }, [])

  return (
    <div className={`${styles.root} container`}>
      <div className="row">
        <div className="col-3of24 col-sm-12of12">
          <div className={styles.filters}>
            <Ruler className={styles.ruler} cm={8} mm={4} progress={progress} />
          </div>
        </div>

        <div className="col-18of24 offset-3of24 col-sm-12of12 offset-sm-0">
          <div ref={gridRef} className="row">
            {projects.map((project, i) => (
              <TransitionLink
                key={project.slug}
                className={`${styles.item} col-8of18 col-sm-12of12 offset-sm-0 ${
                  i % 2 === 1 ? 'offset-2of18' : ''
                }`}
                href={`/work/${project.slug}`}
                data-cursor="case"
              >
                <div className={styles.parallax}>
                  {/* The project thumbnail carries the card; the client's own
                      mark sits over it as a badge, so both read at a glance. */}
                  <div className={styles.mark}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.thumb}
                      src={project.thumbnail}
                      alt={project.title}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <ClientMark
                      className={styles.badge}
                      src={project.image}
                      name={project.title}
                      eager={i < 3}
                    />
                  </div>
                  <div className={styles.info}>
                    <h2 className={`${styles.title} t-h4`}>
                      <MonopoText>{project.title}</MonopoText>
                    </h2>
                    <ul className={`${styles.categories} t-list t-h6 t-h6--spacing`}>
                      {project.categories.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <p className={`${styles.blurb} t-text--sm`}>{project.description}</p>
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>

          <p className={`${styles.count} t-text--sm`}>{projects.length} clients</p>
        </div>
      </div>
    </div>
  )
}
