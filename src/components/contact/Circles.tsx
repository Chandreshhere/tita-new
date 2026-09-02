'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import styles from './Circles.module.scss'

/**
 * `c-Circles` — the concentric-ring motif that punctuates the Contact column.
 *
 * Drawn to a 2D canvas rather than as WebGL: it's a handful of stroked ellipses
 * and putting it on the GPU would mean a third live context on this page for no
 * visual gain.
 */
export function Circles({ className, rings = 9 }: { className?: string; rings?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    let width = 0
    let height = 0
    const reduced = prefersReducedMotion()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = 'currentColor'
      ctx.strokeStyle = getComputedStyle(canvas).color
      ctx.lineWidth = 1

      const cx = width / 2
      const cy = height / 2
      const max = Math.min(width, height) / 2

      for (let i = 0; i < rings; i++) {
        const p = (i + 1) / rings
        const wobble = reduced ? 0 : Math.sin(t * 0.6 + i * 0.7) * max * 0.03
        ctx.beginPath()
        ctx.ellipse(
          cx + (reduced ? 0 : Math.cos(t * 0.4 + i) * max * 0.04),
          cy,
          Math.max(max * p - wobble, 1),
          Math.max(max * p * 0.62 + wobble, 1),
          0,
          0,
          Math.PI * 2,
        )
        ctx.stroke()
      }

      if (!reduced) {
        t += 0.016
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    draw()

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      gsap.killTweensOf(canvas)
    }
  }, [rings])

  return <canvas ref={canvasRef} className={`${styles.root} ${className ?? ''}`} aria-hidden="true" />
}
