'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { projects } from '@/data/projects'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import { ClientMark } from './ClientMark'
import styles from './WorkGrid.module.scss'

/**
 * The portfolio grid — every client, in collection order.
 *
 * The collection rail that used to sit down the left (All · Renaissance ·
 * Amplify · Compose · Ignite · Genesis) is gone, along with its mobile select
 * and the enter/exit animation that swapped one filtered set for another. The
 * grid now runs the full measure.
 *
 * Items alternate between the two 8-of-18 columns and every other one carries a
 * parallax offset, which is what gives the grid its staggered, non-gridlike
 * rhythm.
 */
export function WorkGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

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
        <div className="col-24of24 col-sm-12of12">
          <div ref={gridRef} className="row">
            {projects.map((project, i) => (
              <TransitionLink
                key={project.slug}
                className={`${styles.item} col-11of24 col-sm-12of12 offset-sm-0 ${
                  i % 2 === 1 ? 'offset-2of24' : ''
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

          <p className={`${styles.count} t-text--sm`}>
            {projects.length} clients
          </p>
        </div>
      </div>
    </div>
  )
}
