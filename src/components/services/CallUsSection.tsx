'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import type { CallUsSection as Section } from '@/data/services'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoLines } from '@/components/ui/MonopoText'
import { PixiImage } from '@/components/webgl/PixiImage'
import styles from './CallUsSection.module.scss'

/**
 * `c-Services-section--sm` — the repeated "Call us if…" editorial block.
 *
 * The three instances share one component and differ only in which optional
 * slots their data fills (quote, portrait link, full-bleed image).
 */
export function CallUsSection({ section }: { section: Section }) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'))
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root })
    }, root)
    return () => ctx.revert()
  }, [])

  const { image, quote } = section

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row stretch">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.info} t-text--sm`}>Call us if</span>
        </div>
        <div className="col-14of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2`} data-title>
            <MonopoLines lineClassName={styles.line}>{section.title}</MonopoLines>
          </h2>
        </div>
      </div>

      <div className={`${styles.content} row stretch`}>
        <div className="col-6of24 offset-2of24 col-md-10of24 offset-md-0 col-sm-11of12 offset-sm-0">
          <div className="row">
            <div className="col-4of6 col-sm-10of11">
              <span className={`${styles.justify} t-text--sm`} data-reveal>
                {section.justify}
              </span>
            </div>
          </div>
          <div className="t-wysiwyg t-text" data-reveal>
            {section.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {quote ? (
          <blockquote
            className="t-quote col-7of24 offset-7of24 col-md-10of24 offset-md-4of24 col-sm-10of12 offset-sm-0"
            data-reveal
          >
            <div className={`${styles.quote} t-wysiwyg t-h5 t-h5--bold`}>
              <p>{quote.text}</p>
            </div>
            <footer className="row">
              <div className="col-3of7 col-sm-7of10">
                <div className={`${styles.author} t-wysiwyg t-text--sm`}>
                  <p>
                    {quote.author.map((line, i) => (
                      <span key={line}>
                        {line}
                        {i < quote.author.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </footer>
          </blockquote>
        ) : (
          image && (
            <div className={`${styles.side} col-7of24 offset-7of24 col-md-10of24 offset-md-4of24 col-sm-12of12 offset-sm-0`}>
              <div className="row">
                <div className="col-6of7 offset-1of7 col-sm-12of12 offset-sm-0">
                  {image.link && (
                    <TransitionLink className={`${styles.sideLink} t-text t-link-tertiary`} href={image.link.href}>
                      <span className="t-link-tertiary-label">{image.link.label}</span>
                      <span className="t-link-tertiary-icon" aria-hidden="true">→</span>
                    </TransitionLink>
                  )}
                  {image.href ? (
                    <TransitionLink href={image.href} data-cursor="discover">
                      <PixiImage
                        className={styles.sideImg}
                        src={image.src}
                        alt=""
                        ratio={image.ratio}
                        sizes="(max-width: 767px) 100vw, 26vw"
                        parallax
                      />
                    </TransitionLink>
                  ) : (
                    <PixiImage
                      className={styles.sideImg}
                      src={image.src}
                      alt=""
                      ratio={image.ratio}
                      sizes="(max-width: 767px) 100vw, 26vw"
                      parallax
                    />
                  )}
                  {image.credits && (
                    <span className={`${styles.credits} t-text--sm`}>{image.credits}</span>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {quote && image && (
        <div className="row">
          <div className="col-20of24 offset-2of24 col-md-24of24 offset-md-0 col-sm-12of12 offset-sm-0">
            {image.href ? (
              <TransitionLink href={image.href} data-cursor="case">
                <PixiImage
                  className={styles.wide}
                  src={image.src}
                  alt=""
                  ratio={image.ratio}
                  sizes="(max-width: 767px) 100vw, 80vw"
                  parallax
                />
              </TransitionLink>
            ) : (
              <PixiImage
                className={styles.wide}
                src={image.src}
                alt=""
                ratio={image.ratio}
                sizes="(max-width: 767px) 100vw, 80vw"
                parallax
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
