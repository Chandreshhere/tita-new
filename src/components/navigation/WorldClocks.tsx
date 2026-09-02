'use client'

import { useEffect, useState } from 'react'
import styles from './WorldClocks.module.scss'

type City = { label: string; tz: string; href: string }

/** TITA runs two studios, both on IST — the labels are what differ. */
const CITIES: City[] = [
  { label: 'Indore', tz: 'Asia/Kolkata', href: 'https://maps.google.com/?q=22.7196,75.8577' },
  { label: 'Ahmedabad', tz: 'Asia/Kolkata', href: 'https://maps.google.com/?q=23.0225,72.5714' },
]

const format = (tz: string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  })
    .format(new Date())
    .toUpperCase()

/**
 * Live local time for each TITA studio.
 *
 * The times render as fixed-width placeholders on the server and are filled in
 * after mount: rendering a real clock during SSR guarantees a hydration
 * mismatch, and the placeholder is the same width as the value, so nothing
 * shifts when it lands.
 */
export function WorldClocks({ className }: { className?: string }) {
  const [times, setTimes] = useState<string[] | null>(null)

  useEffect(() => {
    const tick = () => setTimes(CITIES.map((c) => format(c.tz)))
    tick()

    // Re-sync on the minute boundary rather than every second.
    const now = new Date()
    const toNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    let interval: number
    const timeout = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, 60_000)
    }, toNextMinute)

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])

  return (
    <ul className={`${styles.root} t-list t-h6 ${className ?? ''}`}>
      {CITIES.map((city, i) => (
        <li key={city.label}>
          <a
            className={styles.link}
            href={city.href}
            {...(city.href.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {/* Both studios are on IST, so the time alone would read as a
                duplicate — the city is what distinguishes the rows. */}
            <span className={styles.city}>{city.label}</span>
            <span className="u-visually-hidden"> local time: </span>
            <span className={styles.time} suppressHydrationWarning>
              {times ? times[i] : ' '}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
