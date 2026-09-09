import { AboutSection } from './AboutSection'
import { WorkSection } from './WorkSection'
import { ServiceSection } from './ServiceSection'
import { ProjectSection } from './ProjectSection'
import { TestimonialSection } from './TestimonialSection'
import { TabletTestimonialSection } from './TabletTestimonialSection'
import { StickySection } from './StickySection'
import { ContactSection } from './ContactSection'
import { CtaSection } from './CtaSection'

const ROOT_ID = 'tita-root'

/**
 * Everything below the hero, cloned from the Tita template in `full home
 * .zip` — the same section order the template ships: about, work, service,
 * project, testimonial (desktop and its slider variant below 991px), the
 * pinned big image behind the awards, contact, the CTA marquees and the footer.
 *
 * The template's stylesheet resets `body`, `*` and `h1`–`h6`, so every one of
 * its selectors is prefixed with `.tita` (see `src/styles/tita-sections.css`)
 * and confined to this wrapper — the hero, header and the rest of the site are
 * untouched by it. `w-mod-js` on `<html>` comes from the snippet in the root
 * layout and gates the template's pre-interaction states, exactly as the
 * template's own page does.
 */
export function HomeSections() {
  return (
    <div id={ROOT_ID} className="tita">
      <AboutSection />
      <WorkSection />
      <ServiceSection />
      <ProjectSection />
      <TestimonialSection />
      <TabletTestimonialSection />
      <StickySection />
      <ContactSection />
      <CtaSection />
    </div>
  )
}
