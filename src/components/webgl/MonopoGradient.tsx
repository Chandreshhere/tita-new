'use client'

import { useEffect, useRef } from 'react'
import type { GradientConfig } from '@/data/gradients'
import { MonopoGradientRenderer } from './MonopoGradientRenderer'

type Props = {
  config: GradientConfig
  className?: string
  /**
   * Let the pointer drive the noise field. This is the reference's core
   * background interaction, not a decorative extra — off only for the
   * transition curtain, which must stay still while it covers the page.
   */
  interactive?: boolean
  onReady?: (renderer: MonopoGradientRenderer) => void
}

export function MonopoGradient({ config, className, interactive = true, onReady }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<MonopoGradientRenderer | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new MonopoGradientRenderer(host)
    rendererRef.current = renderer

    let cancelled = false
    renderer
      .init(config, { interactive })
      .then(() => {
        if (!cancelled) onReadyRef.current?.(renderer)
      })
      .catch((err) => {
        // A dead WebGL context must not take the page with it — the layer below
        // is already coloured.
        console.warn('[MonopoGradient] WebGL unavailable:', err)
      })

    return () => {
      cancelled = true
      renderer.destroy()
      rendererRef.current = null
    }
    // Mount once. Palette changes animate through `transitionTo` below rather
    // than tearing the context down and rebuilding it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    rendererRef.current?.transitionTo(config, 1.2)
  }, [config])

  useEffect(() => {
    if (!interactive) return
    const onMove = (e: PointerEvent) => {
      rendererRef.current?.setPointer(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight,
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [interactive])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
