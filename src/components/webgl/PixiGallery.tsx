'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Application,
  Assets,
  Geometry,
  GlProgram,
  Mesh,
  Shader,
  Texture,
  UniformGroup,
} from 'pixi.js'
import { gsap } from '@/lib/gsap'
import { dpr, prefersReducedMotion } from '@/lib/motion'
import { GALLERY_FRAGMENT, GALLERY_VERTEX } from './gallery.glsl'
import styles from './PixiGallery.module.scss'

type Props = {
  images: string[]
  ratio?: number
  legendLabel?: string
}

/**
 * `c-PixiGallery` — the studio gallery. Prev/next are the left and right halves
 * of the image itself, and each step displaces the outgoing and incoming frames
 * through a noise seam.
 *
 * The WebGL context is created lazily when the section first scrolls into view
 * and torn down on unmount, so the Team page doesn't hold a second context open
 * for the whole session.
 */
export function PixiGallery({ images, ratio = 56.25, legendLabel }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const uniformsRef = useRef<UniformGroup | null>(null)
  const shaderRef = useRef<Shader | null>(null)
  const texturesRef = useRef<Texture[]>([])
  const meshRef = useRef<Mesh<Geometry, Shader> | null>(null)
  const animatingRef = useRef(false)
  const indexRef = useRef(0)

  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  // Recompute the object-fit: cover factors for whichever textures are showing.
  const applyCover = useCallback((from: Texture, to: Texture) => {
    const app = appRef.current
    const u = uniformsRef.current
    if (!app || !u) return
    const viewAspect = app.screen.width / Math.max(app.screen.height, 1)

    const fit = (tex: Texture): [number, number] => {
      const a = tex.width / Math.max(tex.height, 1)
      return a > viewAspect ? [a / viewAspect, 1] : [1, viewAspect / a]
    }
    const [fx, fy] = fit(from)
    const [tx, ty] = fit(to)
    const cf = u.uniforms.uCoverFrom as Float32Array
    const ct = u.uniforms.uCoverTo as Float32Array
    cf[0] = fx; cf[1] = fy
    ct[0] = tx; ct[1] = ty
    u.update()
  }, [])

  const resize = useCallback(() => {
    const app = appRef.current
    const mesh = meshRef.current
    if (!app || !mesh) return
    mesh.scale.set(app.screen.width, app.screen.height)
    const textures = texturesRef.current
    if (textures.length) {
      applyCover(textures[indexRef.current], textures[indexRef.current])
    }
    app.render()
  }, [applyCover])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let destroyed = false
    let app: Application | null = null
    let ro: ResizeObserver | null = null

    // Only spin the context up once the gallery is actually near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        void boot(host)
      },
      { rootMargin: '200px' },
    )
    io.observe(host)

    async function boot(host: HTMLDivElement) {
      try {
        const textures = await Promise.all(images.map((src) => Assets.load<Texture>(src)))
        if (destroyed) return
        texturesRef.current = textures

        app = new Application()
        await app.init({
          backgroundAlpha: 0,
          antialias: false,
          resolution: dpr(2),
          autoDensity: true,
          preference: 'webgl',
          resizeTo: host,
        })
        if (destroyed) {
          try { app.destroy(true, { children: true }) } catch { /* partial init */ }
          app = null
          return
        }

        appRef.current = app
        app.ticker.stop()

        const canvas = app.canvas as HTMLCanvasElement
        canvas.style.position = 'absolute'
        canvas.style.inset = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        host.appendChild(canvas)

        const uniforms = new UniformGroup({
          uProgress:  { value: 0, type: 'f32' },
          uStrength:  { value: 0.22, type: 'f32' },
          uDirection: { value: 1, type: 'f32' },
          uCoverFrom: { value: new Float32Array([1, 1]), type: 'vec2<f32>' },
          uCoverTo:   { value: new Float32Array([1, 1]), type: 'vec2<f32>' },
        })
        uniformsRef.current = uniforms

        const shader = new Shader({
          glProgram: GlProgram.from({
            vertex: GALLERY_VERTEX,
            fragment: GALLERY_FRAGMENT,
            name: 'monopo-gallery',
          }),
          resources: {
            galleryUniforms: uniforms,
            uTextureFrom: textures[0].source,
            uTextureTo: textures[0].source,
          },
        })
        shaderRef.current = shader

        const geometry = new Geometry({
          attributes: {
            aPosition: [0, 0, 1, 0, 1, 1, 0, 1],
            aUV: [0, 0, 1, 0, 1, 1, 0, 1],
          },
          indexBuffer: [0, 1, 2, 0, 2, 3],
        })

        const mesh = new Mesh({ geometry, shader })
        meshRef.current = mesh
        app.stage.addChild(mesh)

        resize()
        ro = new ResizeObserver(resize)
        ro.observe(host)

        setReady(true)
        app.render()
      } catch (err) {
        console.warn('[PixiGallery] falling back to plain images:', err)
      }
    }

    return () => {
      destroyed = true
      io.disconnect()
      ro?.disconnect()
      try {
        meshRef.current?.destroy(true)
      } catch {
        /* mesh may already be gone with the context */
      }
      meshRef.current = null
      shaderRef.current = null
      uniformsRef.current = null
      // Destroying a partially-initialised Pixi app throws from its resize
      // plugin, and an uncaught throw in cleanup unmounts the React tree.
      try {
        appRef.current?.destroy(true, { children: true })
      } catch {
        try { (appRef.current?.canvas as HTMLCanvasElement | undefined)?.remove() } catch {}
      }
      appRef.current = null
      // Textures come from the shared Assets cache and are released, not destroyed,
      // so a remount doesn't have to re-decode them.
      texturesRef.current = []
      setReady(false)
    }
  }, [images, resize])

  const goTo = useCallback(
    (next: number, direction: 1 | -1) => {
      const total = images.length
      const target = (next + total) % total
      if (target === indexRef.current) return

      const app = appRef.current
      const shader = shaderRef.current
      const uniforms = uniformsRef.current
      const textures = texturesRef.current

      setIndex(target)

      if (!app || !shader || !uniforms || !textures.length || animatingRef.current) {
        indexRef.current = target
        return
      }

      animatingRef.current = true
      const from = textures[indexRef.current]
      const to = textures[target]

      shader.resources.uTextureFrom = from.source
      shader.resources.uTextureTo = to.source
      uniforms.uniforms.uDirection = direction
      uniforms.uniforms.uProgress = 0
      applyCover(from, to)

      const proxy = { p: 0 }
      gsap.to(proxy, {
        p: 1,
        duration: prefersReducedMotion() ? 0.001 : 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          uniforms.uniforms.uProgress = proxy.p
          uniforms.update()
          app.render()
        },
        onComplete: () => {
          indexRef.current = target
          // Park both samplers on the settled frame so a resize re-render is stable.
          shader.resources.uTextureFrom = to.source
          uniforms.uniforms.uProgress = 1
          uniforms.update()
          app.render()
          animatingRef.current = false
        },
      })
    },
    [applyCover, images.length],
  )

  const next = useCallback(() => goTo(indexRef.current + 1, 1), [goTo])
  const prev = useCallback(() => goTo(indexRef.current - 1, -1), [goTo])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={styles.root}>
      <div
        className={styles.content}
        style={{ paddingTop: `${ratio}%` }}
        role="group"
        aria-roledescription="carousel"
        aria-label={legendLabel ?? 'Studio gallery'}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <div ref={hostRef} className={styles.canvasHost} aria-hidden="true" />

        {/* Always rendered: the pre-WebGL poster, and the accessible/no-WebGL path. */}
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            className={`${styles.img} ${i === index ? styles.isActive : ''} ${
              ready ? styles.isHidden : ''
            }`}
            src={src}
            alt={`Inside the TITA studio, image ${i + 1} of ${images.length}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}

        <button className={styles.prev} type="button" onClick={prev}>
          <span className="u-visually-hidden">Previous image</span>
        </button>
        <button className={styles.next} type="button" onClick={next}>
          <span className="u-visually-hidden">Next image</span>
        </button>
      </div>

      <div className={`${styles.legend} t-text--sm`} aria-live="polite">
        <span>{pad(index + 1)}</span> / <span>{pad(images.length)}</span>
      </div>
    </div>
  )
}
