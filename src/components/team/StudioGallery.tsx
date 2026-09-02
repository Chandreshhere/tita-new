import { studioGallery } from '@/data/team'
import { MonopoText } from '@/components/ui/MonopoText'
import { PixiGallery } from '@/components/webgl/PixiGallery'
import styles from './StudioGallery.module.scss'

/** `c-PixiGallery` section — "A peek inside our Spitalfields studio". */
export function StudioGallery() {
  return (
    <section className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.info} t-text`}>
            STUDIO<br />LIFE
          </span>
        </div>

        <div className="col-7of24 col-md-9of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2`}>
            <MonopoText>A peek inside the studio →</MonopoText>
          </h2>
        </div>

        <div className="col-14of24 offset-1of24 col-sm-12of12 offset-sm-0">
          <PixiGallery
            images={studioGallery}
            legendLabel="Inside the TITA studio"
          />
        </div>
      </div>
    </section>
  )
}
