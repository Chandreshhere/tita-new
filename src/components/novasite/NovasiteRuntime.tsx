'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SplitText } from 'gsap/SplitText'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * The Novasite template's own runtime, vendored from Webflow's CDN.
 *
 * The section markup is a verbatim copy, and its motion is Webflow IX2 data
 * keyed to the `data-w-id` attributes that markup still carries — that payload
 * lives inside `webflow.734d2955…js`. Loading Webflow's real runtime therefore
 * reproduces the template's interactions exactly, rather than approximating
 * them with a hand-written GSAP timeline. The scripts must run in this order:
 * jQuery first, then the two shared chunks, then the page bundle that boots
 * itself on load.
 */
const SCRIPTS = [
  '/novasite/js/jquery.js',
  '/novasite/js/webflow.schunk.e0c428ff9737f919.js',
  '/novasite/js/webflow.schunk.be7637ad0e011449.js',
  '/novasite/js/webflow.734d2955.7950910bb4aecaef.js',
]

/**
 * Webflow's IX3 engine reaches for `window.gsap`, `window.ScrollTrigger` and
 * `window.SplitText` — the template loads all three from GreenSock's CDN. This
 * app already ships GSAP 3.15, the same version, so the existing instance is
 * published instead of a second copy: one ticker, and one ScrollTrigger
 * registry that Lenis is already driving, shared with the template's triggers.
 */
function publishGsapGlobals() {
  gsap.registerPlugin(SplitText)
  const w = window as unknown as Record<string, unknown>
  w.gsap ??= gsap
  w.ScrollTrigger ??= ScrollTrigger
  w.SplitText ??= SplitText
}

/** One load per document, shared across mounts and React's double-invoked effects. */
let runtime: Promise<void> | null = null

function loadRuntime() {
  if (runtime) return runtime
  publishGsapGlobals()
  runtime = SCRIPTS.reduce<Promise<void>>(
    (chain, src) =>
      chain.then(
        () =>
          new Promise<void>((resolve, reject) => {
            const el = document.createElement('script')
            el.src = src
            el.async = false
            el.onload = () => resolve()
            el.onerror = () => reject(new Error(`Failed to load ${src}`))
            document.body.appendChild(el)
          }),
      ),
    Promise.resolve(),
  )
  return runtime
}

/**
 * The template's forms post to Webflow's own form endpoint using the captured
 * site's ids. There is no backend here, so the submit is intercepted in the
 * capture phase on an ancestor — that runs before the handler Webflow binds to
 * the form itself — and the same `.w-form-done` / `.w-form-fail` panels the
 * template ships are toggled by hand.
 */
function interceptForms(root: HTMLElement) {
  const onSubmit = (event: Event) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement) || !root.contains(form)) return

    event.preventDefault()
    event.stopPropagation()

    const block = form.closest('.w-form')
    if (!block) return
    const done = block.querySelector<HTMLElement>('.w-form-done')
    const fail = block.querySelector<HTMLElement>('.w-form-fail')

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const submit = form.querySelector<HTMLInputElement>('[type="submit"]')
    const label = submit?.value
    if (submit) {
      submit.value = submit.dataset.wait || 'Please wait...'
      submit.disabled = true
    }

    // No backend: resolve against a short delay, then show the template's own
    // success panel. Swap this for a POST and nothing around it has to change.
    window.setTimeout(() => {
      if (submit) {
        submit.value = label ?? submit.value
        submit.disabled = false
      }
      form.style.display = 'none'
      if (fail) fail.style.display = 'none'
      if (done) done.style.display = 'block'
      form.reset()
    }, 600)
  }

  root.addEventListener('submit', onSubmit, true)
  return () => root.removeEventListener('submit', onSubmit, true)
}

/**
 * IX2 scans the DOM once, when the page bundle loads. Routing here is
 * client-side, so a route that mounts new `.novasite` markup after that scan
 * gets none of its interactions — and worse, the template's pre-init CSS leaves
 * those elements hidden. Tearing the store down and re-initialising it with the
 * same data re-scans whatever is on screen now.
 */
function reinitInteractions() {
  const wf = (window as unknown as { Webflow?: { require?: (m: string) => any; ready?: () => void } }).Webflow
  if (!wf?.require) return
  try {
    const ix2 = wf.require('ix2')
    const data = ix2?.store?.getState?.()?.ixData
    if (ix2 && data) {
      ix2.destroy()
      ix2.init(data)
    }
  } catch (error) {
    console.warn('[novasite] could not re-init interactions', error)
  }
  // Re-binds the widgets too — the dropdowns and the testimonial slider.
  try {
    wf.ready?.()
  } catch {
    /* widget re-init is best effort */
  }
}

export function NovasiteRuntime({ rootId }: { rootId?: string }) {
  const pathname = usePathname()

  useEffect(() => {
    const root = (rootId && document.getElementById(rootId)) || document.body
    const detach = interceptForms(root)

    let cancelled = false
    loadRuntime()
      .then(() => {
        if (!cancelled) reinitInteractions()
      })
      .catch((error) => console.error('[novasite] runtime failed', error))

    return () => {
      cancelled = true
      detach()
    }
  }, [rootId, pathname])

  return null
}
