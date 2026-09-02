import { SERVICES_GRADIENT } from '@/data/gradients'
import { IntroGradient } from '@/components/ui/IntroGradient'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './ServicesHero.module.scss'

const LINES = ['The Trinity', 'Technology · Brand · Media']

/**
 * A banner rather than a full screen of gradient: the page's first real section
 * is on screen when you land, so the scroll cue the full-height version needed
 * is gone with it.
 */
export function ServicesHero() {
  return (
    <IntroGradient
      short
      config={SERVICES_GRADIENT}
      foot={
        <div className="container">
          <div className="row">
            <div className="col-10of24 col-sm-12of12">
              <span className={`${styles.info} t-text--sm`}>
                [ Art. Intelligence. Impact. ]
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="container">
        <div className="row">
          <div className="col-20of24 col-sm-12of12">
            <h1 className={`${styles.title} t-h1`}>
              {LINES.map((line, i) => (
                <span className={`${styles.line} ${styles[`line${i}`]}`} key={line}>
                  <span data-line>
                    <MonopoText>{line}</MonopoText>
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </IntroGradient>
  )
}
