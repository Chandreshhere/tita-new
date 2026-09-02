'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import type { GradientConfig } from '@/data/gradients'
import type { MonopoGradientRenderer } from '@/components/webgl/MonopoGradientRenderer'

type Api = {
  register: (r: MonopoGradientRenderer) => void
  /** Morph the page background to a new palette. */
  setPalette: (config: GradientConfig, duration?: number) => void
}

const Ctx = createContext<Api>({ register: () => {}, setPalette: () => {} })
export const useHomeGradient = () => useContext(Ctx)

/**
 * Shares the home page's single background renderer between the hero and the
 * project stack.
 *
 * On the reference the gradient is one fixed layer for the whole page, and the
 * project stack morphs its palette to each project's own colours as it scrolls.
 * Handing the renderer down through context is what lets the stack drive a
 * canvas the hero owns, without a second WebGL context.
 */
export function HomeGradientProvider({ children }: { children: ReactNode }) {
  const rendererRef = useRef<MonopoGradientRenderer | null>(null)
  const pendingRef = useRef<{ config: GradientConfig; duration: number } | null>(null)

  const register = useCallback((r: MonopoGradientRenderer) => {
    rendererRef.current = r
    // The stack can settle on a project before WebGL finishes initialising.
    if (pendingRef.current) {
      r.transitionTo(pendingRef.current.config, pendingRef.current.duration)
      pendingRef.current = null
    }
  }, [])

  const setPalette = useCallback((config: GradientConfig, duration = 1.1) => {
    const r = rendererRef.current
    if (!r) {
      pendingRef.current = { config, duration }
      return
    }
    r.transitionTo(config, duration)
  }, [])

  const value = useMemo(() => ({ register, setPalette }), [register, setPalette])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
