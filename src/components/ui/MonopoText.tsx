import { Fragment, type ReactNode } from 'react'

/**
 * Heading text, upright throughout.
 *
 * This used to carry the monopo wordmark motif — every `o` and `i` swapped into
 * the italic cut. That went with the type change: Clash Display ships no italic,
 * so the motif could only ever render as a synthetic oblique, and the site is
 * TITA's rather than the reference's now.
 *
 * What remains is the line handling: a `\n` in the source becomes a hard break,
 * matching the `<br>` the original uses inside a handful of headings. Kept as a
 * component so the 28 call sites, and `MonopoLines` below, stay unchanged.
 */
export function MonopoText({ children }: { children: string }) {
  const nodes: ReactNode[] = []
  let buffer = ''
  let key = 0

  const flush = () => {
    if (buffer) {
      nodes.push(<Fragment key={key++}>{buffer}</Fragment>)
      buffer = ''
    }
  }

  for (const char of children) {
    if (char === '\n') {
      flush()
      nodes.push(<br key={key++} />)
    } else {
      buffer += char
    }
  }
  flush()

  return <>{nodes}</>
}

/**
 * Same text handling, but each `\n`-separated line is wrapped in its own
 * `[data-line]` element so `createTextReveal` can mask and stagger them.
 */
export function MonopoLines({
  children,
  className,
  lineClassName,
}: {
  children: string
  className?: string
  lineClassName?: string
}) {
  const lines = children.split('\n')
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span className={lineClassName} data-line-mask key={i}>
          <span data-line>
            <MonopoText>{line}</MonopoText>
          </span>
        </span>
      ))}
    </span>
  )
}
