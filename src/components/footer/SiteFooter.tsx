import { NovasiteFooter } from '@/components/novasite/NovasiteFooter'

/**
 * The site footer — the Novasite one, on every page.
 *
 * It used to be the home page's alone, with the rest of the site carrying a
 * different footer entirely. The `.novasite` wrapper is what its stylesheet is
 * scoped to, and `w-mod-*` on `<html>` plus the runtime mounted in `AppShell`
 * are what drive its reveals and the marquee along the bottom.
 */
export function SiteFooter() {
  return (
    <div className="novasite">
      <NovasiteFooter />
    </div>
  )
}
