import styles from './ClientMark.module.scss'

/**
 * A client's mark on a dark field, as TITA presents its portfolio.
 *
 * A few logos 404 on the studio's own server, so `src` is optional: those
 * clients get their name set as a wordmark instead of a broken image.
 */
export function ClientMark({
  src,
  name,
  className,
  eager = false,
}: {
  src?: string
  name: string
  className?: string
  eager?: boolean
}) {
  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.img}
          src={src}
          alt={name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <span className={styles.wordmark}>{name}</span>
      )}
    </div>
  )
}
