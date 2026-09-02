'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { teamMembers } from '@/data/team'
import { MonopoText } from '@/components/ui/MonopoText'
import { PixiImage } from '@/components/webgl/PixiImage'
import styles from './TeamGrid.module.scss'

/**
 * The founder grid.
 *
 * Members alternate between the two 8-of-17 columns; the right-hand track is
 * pushed down and drifts against the scroll, which is what stops it reading as a
 * regular card grid.
 */
export function TeamGrid() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(`.${styles.item}`).forEach((item, i) => {
        if (i % 2 === 0) return
        gsap.fromTo(
          item,
          { y: 70 },
          {
            y: -70,
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
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-4of24 col-sm-12of12">
          <div className={styles.titleWrap}>
            <div className="row">
              <div className="col-1of4 col-sm-1of9">
                <span className="t-h2" aria-hidden="true">→</span>
              </div>
              <div className="col-3of4 col-sm-8of9">
                <h2 className="t-h2">
                  <MonopoText>Founded by</MonopoText>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-17of24 offset-3of24 col-sm-10of12 offset-sm-2of12">
          <ul className={`${styles.list} row t-list`}>
            {teamMembers.map((member, i) => (
              <li
                className={`${styles.item} col-8of17 col-sm-10of10 offset-sm-0 ${
                  i % 2 === 1 ? 'offset-1of17' : ''
                }`}
                key={member.slug}
              >
                <PixiImage
                  className={styles.img}
                  src={member.image}
                  alt={member.name}
                  ratio={125}
                  sizes="(max-width: 767px) 84vw, 30vw"
                  priority={i < 2}
                />
                <div className={styles.info}>
                  <h3 className={`${styles.name} t-h4`}>
                    <MonopoText>{member.name}</MonopoText>
                  </h3>
                  <ul className={`${styles.roles} t-list t-h6 t-h6--spacing`}>
                    {member.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
