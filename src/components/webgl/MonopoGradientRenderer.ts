import {
  Application,
  Geometry,
  GlProgram,
  Mesh,
  Shader,
  UniformGroup,
} from 'pixi.js'
import { gsap } from '@/lib/gsap'
import { dpr, hexToRgb, isMobileViewport, prefersReducedMotion } from '@/lib/motion'
import type { GradientConfig } from '@/data/gradients'
import { FRAGMENT, VERTEX } from './gradient.glsl'

/**
 * Owns one WebGL context and draws the monopo gradient into it.
 *
 * Two things are load-bearing and were measured off the live site rather than
 * invented:
 *
 * - **The pointer drives the field.** `displacement` tracks pointer X across
 *   `0 → DISPLACEMENT_MAX`, and `seed` tracks pointer Y across `-1 → 1`. That is
 *   the whole "interactive background": moving the cursor re-shapes the noise
 *   the colour sheets are displaced by, so they visibly flow under it.
 * - **Grain is part of the shader**, at `noiseIntensity` 0.04 with `noiseSize`
 *   0.5, measured in screen pixels. Without it the gradient looks like plastic.
 */

/**
 * Destroying a Pixi Application is not idempotent, and destroying one whose
 * `init()` never finished throws `this._cancelResize is not a function` from the
 * resize plugin. Either case throws inside a React cleanup, which unmounts the
 * whole tree and blanks the page — so every teardown goes through here.
 */
function safeDestroyApp(app: Application | null) {
  if (!app) return
  try {
    app.destroy(true, { children: true, texture: true })
  } catch {
    // Best effort: drop the canvas so nothing is left painting.
    try {
      ;(app.canvas as HTMLCanvasElement | undefined)?.remove()
    } catch {
      /* nothing left to clean up */
    }
  }
}

const DISPLACEMENT_MAX = 5
const NOISE_SIZE = 0.5
const NOISE_INTENSITY = 0.04

export class MonopoGradientRenderer {
  private app: Application | null = null
  private mesh: Mesh<Geometry, Shader> | null = null
  private uniforms: UniformGroup | null = null
  private raf = 0
  private destroyed = false
  private visible = true
  private ro: ResizeObserver | null = null

  /** Smoothed pointer, 0..1 in viewport space. */
  private pointer = { x: 0.5, y: 0.5 }
  private target = { x: 0.5, y: 0.5 }
  /** Set while a palette tween is mid-flight so the pointer doesn't fight it. */
  private pointerEnabled = true

  readonly canvasHost: HTMLElement

  constructor(host: HTMLElement) {
    this.canvasHost = host
  }

  async init(config: GradientConfig, opts: { alpha?: number; interactive?: boolean } = {}) {
    if (this.destroyed) return
    this.pointerEnabled = opts.interactive ?? true

    const app = new Application()
    await app.init({
      backgroundAlpha: 0,
      antialias: false,
      resolution: dpr(isMobileViewport() ? 1.5 : 2),
      autoDensity: true,
      powerPreference: 'low-power',
      preference: 'webgl',
      resizeTo: this.canvasHost,
    })

    if (this.destroyed) {
      // Unmounted while init() was still awaiting. Tear down what exists, but
      // via the same guarded path — see `safeDestroyApp`.
      safeDestroyApp(app)
      return
    }

    this.app = app
    app.ticker.stop() // we drive the loop so we can pause it when hidden

    const canvas = app.canvas as HTMLCanvasElement
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.setAttribute('aria-hidden', 'true')
    this.canvasHost.appendChild(canvas)

    this.uniforms = new UniformGroup({
      color1:            { value: new Float32Array(hexToRgb(config.color1)), type: 'vec3<f32>' },
      color2:            { value: new Float32Array(hexToRgb(config.color2)), type: 'vec3<f32>' },
      color3:            { value: new Float32Array(hexToRgb(config.color3)), type: 'vec3<f32>' },
      color4:            { value: new Float32Array(hexToRgb(config.color4)), type: 'vec3<f32>' },
      colorSize:         { value: config.colorSize, type: 'f32' },
      colorSpacing:      { value: config.colorSpacing, type: 'f32' },
      colorRotation:     { value: config.colorRotation, type: 'f32' },
      colorSpread:       { value: config.colorSpread, type: 'f32' },
      displacement:      { value: config.displacement, type: 'f32' },
      zoom:              { value: config.zoom, type: 'f32' },
      spacing:           { value: config.spacing, type: 'f32' },
      seed:              { value: config.seed, type: 'f32' },
      viewportSize:      { value: new Float32Array([app.screen.width, app.screen.height]), type: 'vec2<f32>' },
      colorOffset:       { value: new Float32Array(config.colorOffset), type: 'vec2<f32>' },
      transformPosition: { value: new Float32Array(config.position), type: 'vec2<f32>' },
      noiseSize:         { value: NOISE_SIZE, type: 'f32' },
      noiseIntensity:    { value: NOISE_INTENSITY, type: 'f32' },
      uAlpha:            { value: opts.alpha ?? 1, type: 'f32' },
    })

    // Clip-space quad: the reference's vertex shader passes position straight
    // through, so the geometry is -1..1 rather than a unit square.
    const geometry = new Geometry({
      attributes: { aPosition: [-1, -1, 1, -1, 1, 1, -1, 1] },
      indexBuffer: [0, 1, 2, 0, 2, 3],
    })

    const shader = new Shader({
      glProgram: GlProgram.from({ vertex: VERTEX, fragment: FRAGMENT, name: 'monopo-gradient' }),
      resources: { gradientUniforms: this.uniforms },
    })

    const mesh = new Mesh({ geometry, shader })
    this.mesh = mesh
    app.stage.addChild(mesh)

    this.resize()
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.canvasHost)
    document.addEventListener('visibilitychange', this.onVisibility)

    this.loop()
  }

  private resize = () => {
    if (!this.app || !this.uniforms) return
    const { width, height } = this.app.screen
    const v = this.uniforms.uniforms.viewportSize as Float32Array
    v[0] = width
    v[1] = height
    this.uniforms.update()
  }

  private onVisibility = () => {
    this.visible = document.visibilityState === 'visible'
    if (this.visible && !this.raf && !this.destroyed) this.loop()
  }

  private loop = () => {
    if (this.destroyed) return
    if (!this.visible) {
      this.raf = 0
      return
    }

    const u = this.uniforms
    if (u) {
      // Ease toward the pointer. The reference smooths hard — the sheets keep
      // drifting for a beat after the cursor stops.
      this.pointer.x += (this.target.x - this.pointer.x) * 0.045
      this.pointer.y += (this.target.y - this.pointer.y) * 0.045

      if (this.pointerEnabled && !prefersReducedMotion()) {
        u.uniforms.displacement = this.pointer.x * DISPLACEMENT_MAX
        u.uniforms.seed = this.pointer.y * 2 - 1
      }
      u.update()
    }

    this.app?.render()
    this.raf = requestAnimationFrame(this.loop)
  }

  /** `x` and `y` are 0..1 in viewport space. */
  setPointer(x: number, y: number) {
    this.target.x = x
    this.target.y = y
  }

  setAlpha(value: number) {
    if (!this.uniforms) return
    this.uniforms.uniforms.uAlpha = value
    this.uniforms.update()
  }

  /**
   * Morphs every parameter — colours included — toward `next`.
   *
   * Used both for route changes and, on the home page, for the per-project
   * palette that follows the sticky project stack.
   */
  transitionTo(next: GradientConfig, duration = 1.2): gsap.core.Tween | undefined {
    const u = this.uniforms
    if (!u) return

    const keys = ['color1', 'color2', 'color3', 'color4'] as const
    const proxy: Record<string, number> = {
      colorSize: u.uniforms.colorSize as number,
      colorSpacing: u.uniforms.colorSpacing as number,
      colorRotation: u.uniforms.colorRotation as number,
      colorSpread: u.uniforms.colorSpread as number,
      zoom: u.uniforms.zoom as number,
      spacing: u.uniforms.spacing as number,
      offX: (u.uniforms.colorOffset as Float32Array)[0],
      offY: (u.uniforms.colorOffset as Float32Array)[1],
      posX: (u.uniforms.transformPosition as Float32Array)[0],
      posY: (u.uniforms.transformPosition as Float32Array)[1],
    }
    keys.forEach((k) => {
      const cur = u.uniforms[k] as Float32Array
      proxy[`${k}r`] = cur[0]
      proxy[`${k}g`] = cur[1]
      proxy[`${k}b`] = cur[2]
    })

    const targets: Record<string, number> = {
      colorSize: next.colorSize,
      colorSpacing: next.colorSpacing,
      colorRotation: next.colorRotation,
      colorSpread: next.colorSpread,
      zoom: next.zoom,
      spacing: next.spacing,
      offX: next.colorOffset[0],
      offY: next.colorOffset[1],
      posX: next.position[0],
      posY: next.position[1],
    }
    keys.forEach((k) => {
      const [r, g, b] = hexToRgb(next[k])
      targets[`${k}r`] = r
      targets[`${k}g`] = g
      targets[`${k}b`] = b
    })

    return gsap.to(proxy, {
      ...targets,
      duration,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onUpdate: () => {
        u.uniforms.colorSize = proxy.colorSize
        u.uniforms.colorSpacing = proxy.colorSpacing
        u.uniforms.colorRotation = proxy.colorRotation
        u.uniforms.colorSpread = proxy.colorSpread
        u.uniforms.zoom = proxy.zoom
        u.uniforms.spacing = proxy.spacing
        const off = u.uniforms.colorOffset as Float32Array
        off[0] = proxy.offX
        off[1] = proxy.offY
        const pos = u.uniforms.transformPosition as Float32Array
        pos[0] = proxy.posX
        pos[1] = proxy.posY
        keys.forEach((k) => {
          const arr = u.uniforms[k] as Float32Array
          arr[0] = proxy[`${k}r`]
          arr[1] = proxy[`${k}g`]
          arr[2] = proxy[`${k}b`]
        })
        u.update()
      },
    })
  }

  destroy() {
    this.destroyed = true
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.ro?.disconnect()
    this.ro = null
    try {
      this.mesh?.destroy(true)
    } catch {
      /* mesh may already be gone with the context */
    }
    this.mesh = null
    this.uniforms = null
    safeDestroyApp(this.app)
    this.app = null
  }
}
