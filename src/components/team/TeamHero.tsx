import { TEAM_GRADIENT } from '@/data/gradients'
import { IntroGradient } from '@/components/ui/IntroGradient'
import { MonopoText } from '@/components/ui/MonopoText'
import { ScrollCue } from '@/components/ui/ScrollCue'
import styles from './TeamHero.module.scss'

const LINES = ['Two cities.', 'Two energies.', 'One vision.']

export function TeamHero() {
  return (
    <IntroGradient
      config={TEAM_GRADIENT}
      foot={
        <div className="container">
          <div className="row bottom">
            <div className="col-3of24 offset-6of24 col-md-5of24 offset-md-1of24 col-sm-6of12 offset-sm-0">
              <p className={`${styles.info} t-text--sm`}>[ Indore · Ahmedabad ]</p>
            </div>
            <div className="col-5of24 offset-5of24 col-md-7of24 col-sm-12of12 offset-sm-0">
              <div className={`${styles.text} t-wysiwyg t-text`}>
                <p>
                  TITA is a digital marketing agency born in Indore and now in Ahmedabad.
                  We operate at the intersection of art, strategy, technology, and
                  performance.
                </p>
              </div>
            </div>
            <div className={`${styles.cue} col-2of24 offset-1of24`}>
              <ScrollCue />
            </div>
          </div>
        </div>
      }
    >
      <h1 className={`${styles.title} t-h1`}>
        {LINES.map((line, i) => (
          <span className={`${styles.line} ${styles[`line${i}`]}`} key={line}>
            <span data-line>
              <MonopoText>{line}</MonopoText>
            </span>
          </span>
        ))}
      </h1>
    </IntroGradient>
  )
}
