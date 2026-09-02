import type { Metadata, Viewport } from 'next'
import { Inter_Tight } from 'next/font/google'
import { AppShell } from '@/components/core/AppShell'
import '@/styles/globals.scss'
// The footer is the Novasite one on every route, and its rules are scoped
// under `.novasite`, so the template stylesheet is site-wide rather than
// home-only.
import '@/styles/novasite.css'
import '@/styles/novasite-tita.css'

/**
 * Inter Tight is the body face of the Novasite build — the paragraphs, nav and
 * footer copy below the hero are set in it — and now carries body text across
 * the whole site. Clash Display takes the headings (see `_fonts.scss`).
 */
const sans = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thisisthat.co.in'),
  title: {
    default: 'TITA — This Is That Agency',
    template: '%s | TITA',
  },
  description:
    'Marketing is no longer made. It is composed. Where art meets algorithm. TITA is a digital marketing agency born in Indore and now in Ahmedabad, working across technology, brand and media.',
  keywords: [
    'TITA', 'This Is That Agency', 'Digital marketing agency', 'Indore',
    'Ahmedabad', 'India', 'Brand identity', 'Performance marketing',
    'Social media marketing', 'UI/UX', 'Shopify', 'E-commerce', 'Media planning',
    'Campaign', 'Art direction', 'Packaging', 'Web design',
  ],
  openGraph: {
    title: 'TITA — This Is That Agency',
    description:
      'Art. Intelligence. Impact. Where art meets algorithm — a digital marketing agency in Indore and Ahmedabad.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `data-wf-page` is what the Novasite clone's interactions hang on: Webflow
    // keys page-scoped IX2 targets as `<pageId>|<elementId>` and reads the page
    // id from this attribute. Without it every one of those targets fails to
    // resolve and the template's hovers and reveals are silently inert.
    <html
      lang="en"
      className={sans.variable}
      data-wf-page="6925368d84535d51ca629726"
    >
      <body>
        {/* The Novasite clone on the home page keys its pre-interaction states
            off `w-mod-js`, exactly as the template's own page does. Setting it
            during parse — before paint — is what stops those sections flashing
            in at their finished state while the Webflow runtime loads. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);',
          }}
        />
        <a href="#main" className="u-visually-hidden">Skip to content</a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
