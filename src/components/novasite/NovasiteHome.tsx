import '@/styles/novasite.css'
import '@/styles/novasite-tita.css'

import { NovasiteAbout } from './NovasiteAbout'
import { NovasiteWork } from './NovasiteWork'
import { NovasiteService } from './NovasiteService'
import { NovasiteProject } from './NovasiteProject'
import { NovasiteTestimonial } from './NovasiteTestimonial'
import { NovasiteTabletTestimonial } from './NovasiteTabletTestimonial'
import { NovasiteSticky } from './NovasiteSticky'
import { NovasiteContact } from './NovasiteContact'
import { NovasiteCta } from './NovasiteCta'
import { NovasiteFooter } from './NovasiteFooter'
import { NovasiteRuntime } from './NovasiteRuntime'

const ROOT_ID = 'novasite-root'

/**
 * Everything below the hero, cloned from the Novasite template in `full home
 * .zip` — the same section order the template ships: about, work, service,
 * project, testimonial (desktop and its slider variant below 991px), the
 * pinned big image behind the awards, contact, the CTA marquees and the footer.
 *
 * The template's stylesheet resets `body`, `*` and `h1`–`h6`, so every one of
 * its selectors is prefixed with `.novasite` (see `src/styles/novasite.css`)
 * and confined to this wrapper — the hero, header and the rest of the site are
 * untouched by it. `w-mod-js` on `<html>` comes from the snippet in the root
 * layout and gates the template's pre-interaction states, exactly as the
 * template's own page does.
 */
export function NovasiteHome() {
  return (
    <div id={ROOT_ID} className="novasite">
      <NovasiteAbout />
      <NovasiteWork />
      <NovasiteService />
      <NovasiteProject />
      <NovasiteTestimonial />
      <NovasiteTabletTestimonial />
      <NovasiteSticky />
      <NovasiteContact />
      <NovasiteCta />
      <NovasiteFooter />
      <NovasiteRuntime rootId={ROOT_ID} />
    </div>
  )
}
