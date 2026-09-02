type Props = {
  width?: number
  className?: string
}

/**
 * The TITA wordmark, drawn as inline geometry so it inherits `currentColor` and
 * flips with the light/dark sections without a second asset.
 *
 * Letterforms are a geometric slab-free grotesk built from rectangles — T I T A
 * — matching the tone of the studio's own mark while staying resolution-free.
 */
export function Logo({ width = 132, className }: Props) {
  const height = (width * 163) / 926.2

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 620 163"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TITA"
    >
      {/* T */}
      <path d="M0 24h132v28H80v87H52V52H0V24z" />
      {/* I */}
      <path d="M164 24h28v115h-28V24z" />
      {/* T */}
      <path d="M216 24h132v28h-52v87h-28V52h-52V24z" />
      {/* A */}
      <path d="M438 24h30l64 115h-32l-12-22h-70l-12 22h-32l64-115zm15 33-22 40h44l-22-40z" />
      {/* Registered-style dot, echoing the studio's mark */}
      <circle cx="600" cy="132" r="8" />
    </svg>
  )
}
