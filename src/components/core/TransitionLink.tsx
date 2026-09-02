'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'
import { usePageTransition } from './PageTransition'

type Props = ComponentProps<typeof Link> & { href: string }

/**
 * A `next/link` that routes through the gradient curtain.
 *
 * It stays a real anchor — middle-click, cmd-click and "open in new tab" all
 * behave normally, and only a plain left-click is intercepted.
 */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition()

  const isInternal = typeof href === 'string' && href.startsWith('/')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (!isInternal || e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

    e.preventDefault()
    navigate(href)
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
