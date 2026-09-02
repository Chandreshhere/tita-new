'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { prefersReducedMotion } from '@/lib/motion'
import type { Project } from '@/data/projects'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import { ClientMark } from './ClientMark'
import { ScrollCue } from '@/components/ui/ScrollCue'
import styles from './ProjectDetail.module.scss'

export function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const lines = root.querySelectorAll('[data-line]')
    if (prefersReducedMotion()) {
      gsap.set(lines, { yPercent: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out', delay: 0.3 },
      )
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root })
    }, root)

    return () => ctx.revert()
  }, [project.slug])

  return (
    <div ref={rootRef} className={styles.root}>
      <section className={`${styles.hero} container`}>
        <div className="row bottom">
          <div className="col-3of24 col-sm-12of12">
            <TransitionLink className={`${styles.back} t-link-tertiary`} href="/work">
              <span className="t-link-tertiary-icon" aria-hidden="true">←</span>
              <span className="t-link-tertiary-label">All portfolio</span>
            </TransitionLink>
          </div>

          <div className="col-16of24 col-sm-12of12">
            <ul className={`${styles.categories} t-list t-h6 t-h6--spacing`} data-reveal>
              <li>{project.collection}</li>
              {project.categories.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h1 className={`${styles.title} t-h1`}>
              <span className={styles.line}>
                <span data-line>
                  <MonopoText>{project.title}</MonopoText>
                </span>
              </span>
            </h1>
          </div>

          <div className={`${styles.cue} col-2of24 offset-1of24`}>
            <ScrollCue />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-22of24 offset-1of24 col-sm-12of12 offset-sm-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.thumb}
              src={project.thumbnail}
              alt={project.title}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-4of24 offset-1of24 col-sm-12of12 offset-sm-0">
            <ClientMark className={styles.mark} src={project.image} name={project.title} eager />
          </div>
          <div className="col-12of24 offset-1of24 col-sm-12of12 offset-sm-0">
            <p className={`${styles.blurb} t-text`} data-reveal>
              {project.description}
            </p>
            {/* No link for the handful of clients whose site we could not confirm. */}
            {project.url ? (
              <a
                className={`${styles.visit} t-link-tertiary`}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <span className="t-link-tertiary-label">
                  {project.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </span>
                <span className="t-link-tertiary-icon" aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className={`${styles.next} container`}>
        <div className="row">
          <div className="col-2of24 col-md-24of24 col-sm-12of12">
            <span className={`${styles.nextLabel} t-text--sm`}>Next project</span>
          </div>
          <div className="col-16of24 col-sm-12of12">
            <TransitionLink
              className={styles.nextLink}
              href={`/work/${next.slug}`}
              data-cursor="case"
            >
              <h2 className="t-h2" data-reveal>
                <MonopoText>{next.title}</MonopoText>
              </h2>
            </TransitionLink>
          </div>
        </div>
      </section>
    </div>
  )
}
