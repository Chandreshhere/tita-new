'use client'

import { useEffect, useState } from 'react'
import styles from './CookieNotice.module.scss'

const KEY = 'tita-cookies-accepted'

/** The small notice that slides up in the bottom corner. */
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let accepted = false
    try {
      accepted = window.localStorage.getItem(KEY) === '1'
    } catch {
      // Private mode / blocked storage: show the notice, just don't remember.
    }
    if (accepted) return

    const id = window.setTimeout(() => setVisible(true), 1800)
    return () => window.clearTimeout(id)
  }, [])

  const accept = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(KEY, '1')
    } catch {
      /* nothing to do — the notice simply returns next visit */
    }
  }

  return (
    <div className={`${styles.root} ${visible ? styles.isActive : ''}`} role="region" aria-label="Cookie notice">
      <div className={styles.inner}>
        <div className={`${styles.desc} t-text`}>
          <p>
            This website uses cookies.
            <br />
            <a href="/policy">Learn more</a>.
          </p>
        </div>
        <button
          type="button"
          className={`${styles.btn} t-btn-primary t-btn-primary--nude`}
          onClick={accept}
        >
          <span>Accept</span>
        </button>
      </div>
    </div>
  )
}
