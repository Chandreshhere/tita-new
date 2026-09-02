import { WORK_GRADIENT } from '@/data/gradients'
import { IntroGradient } from '@/components/ui/IntroGradient'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './WorkIntro.module.scss'

const LINES = ['We paint', 'legacies, →', 'not posts']

/**
 * The portfolio hero, on the same banner as Services rather than a full screen
 * of gradient — so the first row of the grid is on screen when you land, and
 * the scroll cue the full-height version needed goes with it.
 *
 * `IntroGradient` owns the reveal: it animates every `[data-line]` and the
 * `[data-foot]` strip, which is why this no longer needs a client timeline of
 * its own.
 */
export function WorkIntro() {
  return (
    <IntroGradient
      short
      config={WORK_GRADIENT}
      foot={
        <div className="container">
          <div className="row">
            <div className="col-10of24 col-sm-12of12">
              <p className={`${styles.info} t-text--sm`}>
                Five collections. Renaissance, Amplify, Compose, Ignite, Genesis.
                Every engagement composed at the intersection of art, strategy,
                technology and performance.
              </p>
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
