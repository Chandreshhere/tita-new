import styles from './Ruler.module.scss'

type Props = {
  /** Number of centimetre marks; each carries `mm` sub-ticks between them. */
  cm?: number
  mm?: number
  /** 0–1 position of the travelling arrow. */
  progress?: number
  align?: 'left' | 'right'
  className?: string
}

/**
 * The measurement motif (`c-*-ruler`) that runs down the margins of the intro
 * gradients, the Home sticky stack, the Work filters and the Contact rail.
 *
 * Purely decorative, so it's `aria-hidden` and built from a small fixed number
 * of nodes — the reference renders roughly 40, not hundreds.
 */
export function Ruler({ cm = 4, mm = 9, progress = 0, align = 'left', className }: Props) {
  return (
    <div
      className={`${styles.root} ${align === 'right' ? styles.alt : ''} ${className ?? ''}`}
      aria-hidden="true"
    >
      {Array.from({ length: cm }, (_, i) => (
        <div className={styles.cm} key={i}>
          {i < cm - 1 &&
            Array.from({ length: mm }, (_, j) => <div className={styles.mm} key={j} />)}
        </div>
      ))}
      <div
        className={styles.cursor}
        style={{ transform: `translateY(${progress * 100}%) translateZ(0)` }}
      />
    </div>
  )
}
