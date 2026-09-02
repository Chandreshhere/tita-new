'use client'

import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { Navigation } from '@/components/navigation/Navigation'
import { SiteFooter } from '@/components/footer/SiteFooter'
import { NovasiteRuntime } from '@/components/novasite/NovasiteRuntime'
import { CustomCursor } from './CustomCursor'
import { PageTransitionProvider } from './PageTransition'
import { Preloader } from './Preloader'
import { SmoothScrollProvider } from './SmoothScrollProvider'
import { CookieNotice } from './CookieNotice'

const bodyClassFor = (pathname: string) => {
  if (pathname === '/') return 'is-index'
  const first = pathname.split('/').filter(Boolean)[0]
  return first ? `is-${first}` : 'is-index'
}

/**
 * The persistent chrome. Everything here outlives route changes, which is what
 * lets the gradient curtain, the cursor and Lenis stay continuous across
 * navigation instead of remounting on every page.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // The reference keys its light/dark palette off a class on <body>.
  useEffect(() => {
    const cls = bodyClassFor(pathname)
    document.body.classList.add(cls)
    return () => document.body.classList.remove(cls)
  }, [pathname])

  // New route, new document height — remeasure once the page has painted.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname])

  return (
    <SmoothScrollProvider>
      <PageTransitionProvider>
        <div className="c-App">
          <Navigation />
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
        {/* Drives every `.novasite` subtree on the page — the cloned sections on
            home and the footer everywhere — and re-scans on each route change. */}
        <NovasiteRuntime />
        <CustomCursor />
        <CookieNotice />
        <Preloader />
      </PageTransitionProvider>
    </SmoothScrollProvider>
  )
}
