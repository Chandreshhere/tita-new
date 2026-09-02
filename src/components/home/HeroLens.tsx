'use client'

import { useEffect, useRef } from 'react'
import {
  Application,
  Geometry,
  GlProgram,
  Mesh,
  Shader,
  Texture,
  UniformGroup,
} from 'pixi.js'
import { dpr, isTouchDevice, prefersReducedMotion } from '@/lib/motion'
import { LENS_FRAGMENT, LENS_VERTEX } from './lens.glsl'
import styles from './HeroLens.module.scss'

type Line = { en: string; alt: string }

/** See the note on the identical helper in MonopoGradientRenderer. */
function safeDestroyApp(app: Application | null) {
  if (!app) return
  try {
    app.destroy(true, { children: true })
  } catch {
    try {
      ;(app.canvas as HTMLCanvasElement | undefined)?.remove()
    } catch {
      /* nothing left to clean up */
    }
  }
}

/**
 * The hero's magnifying bubble.
 *
 * The headline is painted twice into offscreen 2D canvases — the proposition and
 * the studio's own name — and a shader shows the second through a bulge lens
 * that follows the cursor.
 *
 * Everything is measured in coordinates relative to `host`, which is the layer
 * the WebGL canvas is stretched over, and never in viewport coordinates. That
 * distinction is the whole ballgame: the texture is mapped onto `host`, so a
 * viewport-relative measurement is wrong by exactly `scrollY` the moment the
 * page moves — which put the bubble somewhere other than under the cursor, and
 * threw the painted headline upward whenever a late repaint (a webfont
 * resolving, a `--vh` change) happened to land after a scroll.
 *
 * Line geometry is measured off the real DOM `<h1>`, so the canvas copy sits
 * exactly on top of the markup it replaces. The DOM headline stays in the
 * document (visually hidden once this is live) so the page still has a real
 * `<h1>` for assistive tech and crawlers.
 */
export function HeroLens({ lines, titleSelector }: { lines: Line[]; titleSelector: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouchDevice()) return

    const host = hostRef.current
    if (!host) return

    let destroyed = false
    let app: Application | null = null
    let raf = 0
    let ro: ResizeObserver | null = null

    const enCanvas = document.createElement('canvas')
    const altCanvas = document.createElement('canvas')
    let enTex: Texture | null = null
    let altTex: Texture | null = null

    // Cached so a pointermove doesn't force a layout read on every event.
    let hostRect = host.getBoundingClientRect()
    const measureHost = () => { hostRect = host.getBoundingClientRect() }

    const pointer = { x: 0.5, y: 0.5 }
    const smooth = { x: 0.5, y: 0.5 }
    let active = 0
    let activeTarget = 0

    /**
     * Repaint both text layers at the DOM headline's exact position, font and
     * size. Called on mount, on resize, and once webfonts settle.
     */
    const paint = () => {
      const title = document.querySelector<HTMLElement>(titleSelector)
      if (!title) return false

      const lineEls = Array.from(title.querySelectorAll<HTMLElement>('[data-line]'))
      if (lineEls.length !== lines.length) return false

      measureHost()
      const w = hostRect.width
      const h = hostRect.height
      if (!w || !h) return false
      const ratio = dpr(2)

      for (const c of [enCanvas, altCanvas]) {
        c.width = Math.round(w * ratio)
        c.height = Math.round(h * ratio)
      }

      const enCtx = enCanvas.getContext('2d')
      const altCtx = altCanvas.getContext('2d')
      if (!enCtx || !altCtx) return false

      for (const ctx of [enCtx, altCtx]) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        ctx.clearRect(0, 0, w, h)
        ctx.textBaseline = 'alphabetic'
        ctx.fillStyle = '#ffffff'
      }

      const cs = getComputedStyle(lineEls[0])
      const fontSize = parseFloat(cs.fontSize)
      const enFont = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`

      lineEls.forEach((el, i) => {
        // Measure the *wrapper*, not the inner span: the inner one is what the
        // intro timeline animates (yPercent 110 → 0), so measuring it mid-flight
        // paints the whole headline low.
        const r = (el.parentElement ?? el).getBoundingClientRect()
        // Host-relative, so the result is independent of scroll position.
        const x = r.left - hostRect.left
        const y = r.top - hostRect.top

        // Centre the glyphs in the line box using real font metrics — the box is
        // set on a 0.934 line-height, so a nominal baseline lands visibly low.
        enCtx.font = enFont
        const m = enCtx.measureText(lines[i].en)
        const asc = m.actualBoundingBoxAscent || fontSize * 0.72
        const desc = m.actualBoundingBoxDescent || fontSize * 0.2

        enCtx.textAlign = 'left'
        enCtx.fillText(lines[i].en, x, y + (r.height - (asc + desc)) / 2 + asc)

        // The revealed line is set in the same face, shrunk only if it would
        // otherwise run wider than the line it is standing in for — so the copy
        // can be changed freely without it spilling out of the lens.
        let altSize = fontSize
        altCtx.font = `${cs.fontWeight} ${altSize}px ${cs.fontFamily}`
        const altWidth = altCtx.measureText(lines[i].alt).width
        if (altWidth > r.width && altWidth > 0) {
          altSize = fontSize * (r.width / altWidth)
          altCtx.font = `${cs.fontWeight} ${altSize}px ${cs.fontFamily}`
        }
        const am = altCtx.measureText(lines[i].alt)
        const aAsc = am.actualBoundingBoxAscent || altSize * 0.72
        const aDesc = am.actualBoundingBoxDescent || altSize * 0.2

        altCtx.textAlign = 'center'
        altCtx.fillText(lines[i].alt, x + r.width / 2, y + (r.height - (aAsc + aDesc)) / 2 + aAsc)
      })

      enTex?.source.update()
      altTex?.source.update()
      return true
    }

    const boot = async () => {
      if (!paint()) return

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
        safeDestroyApp(app)
        app = null
        return
      }

      const canvas = app.canvas as HTMLCanvasElement
      canvas.style.position = 'absolute'
      canvas.style.inset = '0'
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      host.appendChild(canvas)

      enTex = Texture.from(enCanvas)
      altTex = Texture.from(altCanvas)

      const uniforms = new UniformGroup({
        uResolution: { value: new Float32Array([app.screen.width, app.screen.height]), type: 'vec2<f32>' },
        uLens:       { value: new Float32Array([0.5, 0.5]), type: 'vec2<f32>' },
        uRadius:     { value: 0.176, type: 'f32' },
        uStrength:   { value: 0.34, type: 'f32' },
        uRgb:        { value: 0.0045, type: 'f32' },
        uActive:     { value: 0, type: 'f32' },
      })

      const geometry = new Geometry({
        attributes: { aPosition: [-1, -1, 1, -1, 1, 1, -1, 1] },
        indexBuffer: [0, 1, 2, 0, 2, 3],
      })

      const shader = new Shader({
        glProgram: GlProgram.from({
          vertex: LENS_VERTEX,
          fragment: LENS_FRAGMENT,
          name: 'monopo-hero-lens',
        }),
        resources: {
          lensUniforms: uniforms,
          uTextEn: enTex.source,
          uTextJp: altTex.source,
        },
      })

      const mesh = new Mesh({ geometry, shader })
      app.stage.addChild(mesh)

      // The DOM headline hands over to the canvas only once it is actually
      // drawing, so a WebGL failure leaves the real text on screen.
      document.querySelector<HTMLElement>(titleSelector)?.classList.add(styles.handedOver)

      // Normalised against the host box, not the viewport, so the bubble lands
      // under the cursor at any scroll position.
      const onMove = (e: PointerEvent) => {
        if (!hostRect.width || !hostRect.height) return
        pointer.x = (e.clientX - hostRect.left) / hostRect.width
        pointer.y = (e.clientY - hostRect.top) / hostRect.height
        activeTarget = 1
      }
      const onLeave = () => { activeTarget = 0 }
      // The host scrolls with the page, so its box has to be re-read as it moves.
      const onScroll = () => measureHost()
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      document.addEventListener('pointerleave', onLeave)

      const resize = () => {
        measureHost()
        paint()
        if (!app) return
        const res = uniforms.uniforms.uResolution as Float32Array
        res[0] = app.screen.width
        res[1] = app.screen.height
        uniforms.update()
      }
      ro = new ResizeObserver(resize)
      ro.observe(host)
      void document.fonts?.ready.then(() => paint())
      // Repaint once the hero's entrance timeline has settled, so the measured
      // line boxes are the final ones.
      repaintTimer = window.setTimeout(paint, 2200)

      const loop = () => {
        if (destroyed) return
        smooth.x += (pointer.x - smooth.x) * 0.12
        smooth.y += (pointer.y - smooth.y) * 0.12
        active += (activeTarget - active) * 0.08

        const l = uniforms.uniforms.uLens as Float32Array
        l[0] = smooth.x
        // UV origin is bottom-left; pointer Y is top-down.
        l[1] = 1 - smooth.y
        uniforms.uniforms.uActive = active
        uniforms.update()

        app?.render()
        raf = requestAnimationFrame(loop)
      }
      loop()

      cleanupExtra = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('pointerleave', onLeave)
        document.querySelector<HTMLElement>(titleSelector)?.classList.remove(styles.handedOver)
      }
    }

    let cleanupExtra: (() => void) | null = null
    let repaintTimer = 0

    // Reduced motion keeps the DOM headline and skips the lens entirely.
    if (!prefersReducedMotion()) {
      void boot().catch((err) => console.warn('[HeroLens] disabled:', err))
    }

    return () => {
      destroyed = true
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(repaintTimer)
      ro?.disconnect()
      cleanupExtra?.()
      try {
        enTex?.destroy(true)
        altTex?.destroy(true)
      } catch {
        /* textures may already be gone with the context */
      }
      safeDestroyApp(app)
      app = null
    }
  }, [lines, titleSelector])

  return <div ref={hostRef} className={styles.root} aria-hidden="true" />
}
