/** Environment probes shared by every animated component. */

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouchDevice = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0)

export const isMobileViewport = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

/** Cap the device pixel ratio so WebGL stays cheap on retina/hi-dpi screens. */
export const dpr = (max = 2): number =>
  typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, max)

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** #rrggbb → [r, g, b] in 0..1, for feeding straight into shader uniforms. */
export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
