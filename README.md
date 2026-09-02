# TITA — This Is That Agency

The site for **TITA**, a digital marketing agency in Indore and Ahmedabad.

Two sources, deliberately kept apart:

- **Design and interaction** are a reverse-engineered rebuild of
  [monopo.london](https://monopo.london/) — its grid, type scale, procedural
  gradient, hero lens and scroll behaviour, recovered from the captured HTML/CSS
  in the sibling folders and from the live site's own shader source.
- **All content** is TITA's, transcribed from
  [thisisthat.co.in](https://thisisthat.co.in/) — copy, services, founders,
  studios and contact points — plus the 26-client portfolio, which comes from
  the supplied `website_project_thumbnails` zip rather than the site.

Everything on the home page below the hero is a third source: the **Novasite**
Webflow template in `full home .zip`, cloned verbatim — its markup, stylesheet
and interaction runtime — and then filled with TITA's own copy (see *Home page*
below).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · SCSS Modules · GSAP +
ScrollTrigger · Lenis · PixiJS 8 · Swiper 11

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

---

## What came from the reference, and how

Everything visual is derived from the capture rather than approximated:

### Design, from monopo

| Thing | Source |
|---|---|
| 24-column grid, gutters, breakpoints | `styles.css` — `col-{n}of{d}` / `offset-{n}of{d}`, `.54vw` gutters, 767/979/1440 |
| Type scale | the exact `max(vw, px)` pairs from `.t-h1`–`.t-h6`, `.t-text` |
| Gradient shader + parameters | recovered from the live site (see below) |
| Easing, durations, hover mechanics | `cubic-bezier(.165,.84,.44,1)` etc., lifted rule by rule |

### Content, from TITA

| Thing | Source |
|---|---|
| Proposition, manifesto, philosophy | thisisthat.co.in home + studio |
| The Trinity — Technology / Brand / Media | thisisthat.co.in/studio |
| 26 clients across 5 collections | `website_project_thumbnails.zip` |
| Founders, studios, coordinates, contact | thisisthat.co.in/contact |
| Client marks + editorial imagery | downloaded from the studio's own server |

The `o`/`i`-in-italic motif is derived at render time by `MonopoText`, so
`src/data` stays plain text.

---

## The gradient — recovered, not reimplemented

A first pass approximated the gradient with domain-warped fBm and it was wrong:
too high-frequency, no grain, and static. So the real program was pulled off the
live site by hooking `WebGLRenderingContext.prototype.shaderSource` before their
bundle ran and dumping every shader it compiled.

`src/components/webgl/gradient.glsl.ts` **is their fragment shader**. It works
nothing like an fBm warp:

1. Screen position is aspect-corrected, divided by `zoom`, offset by
   `transformPosition`.
2. A 3D **gradient noise with analytic derivatives** (Inigo Quilez) is sampled at
   `(position, seed)`. Its *derivative* vector — not its value — displaces the
   position by `displacement`. That is what makes the sheets flow.
3. The displaced position is **tiled** by `mod(p - spacing, spacing*2) - spacing`,
   rotated, scaled by `colorSize`, squashed on X by `colorSpread`.
4. The four colours are laid down as **distance fields** from four horizontal
   lines at `y = ±colorSpacing*1.5` and `±colorSpacing*0.5`.
5. Value-noise **grain** is added at `noiseIntensity` 0.04, `noiseSize` 0.5 —
   measured in screen pixels. Without it the whole site looks like plastic.

**The background is pointer-driven**, which is the interaction the clone was
missing entirely. Measured by intercepting their uniform writes while sweeping
the cursor:

| pointer | uniform | mapping |
|---|---|---|
| X | `displacement` | `x / width * 5` |
| Y | `seed` | `y / height * 2 - 1` |

Both are eased toward the target each frame, so the sheets keep drifting for a
beat after the cursor stops.

Parameters live in `src/data/gradients.ts`: page heroes from the captured
`<monopo-gradient>` elements, plus **all 34 per-project palettes** lifted from
the live Prismic payload. Those drive the home page's most distinctive
behaviour — see below.

---

## Architecture notes

### Home page

The hero is this site's own. **Everything below it is the Novasite template from
`full home .zip`, cloned rather than reinterpreted** — its sections in its own
order: `about` · `work` · `service` · `project` · `testimonial` (plus the
`tablet-testimonial` slider below 991px) · `big-image` pinned behind `award` ·
`contact` · `cta` · `footer`. The layout, motion and imagery are the template's;
**all of the words are TITA's**.

It is a real clone, not a lookalike, so three things came across intact:

**The markup** (`src/components/novasite/*.tsx`) is the template's, element for
element. The zip ships a *rendered* DOM capture rather than Webflow source, so
the only things removed were the artefacts of that capture: SplitText's
per-letter `<div>`s (the original sentences are recovered from them), the inline
styles GSAP and IX2 had already written, the widget state Webflow's runtime
rebuilds on init, and a stale Cloudflare Turnstile token.

**The stylesheet** is the template's 126KB `styles.css`, rule for rule, in
`src/styles/novasite.css`. It resets `body`, `*` and `h1`–`h6`, so every selector
is prefixed with `.novasite` and confined to the clone's wrapper — the hero,
header and other routes never see it. Two exceptions are deliberate and both are
load-bearing:

- `:root` keeps its 34 custom properties globally, because Webflow's IX2 resolves
  an animated colour through `getComputedStyle(document.documentElement)` and
  nowhere else. Scoped to `.novasite`, every swatch resolved empty and fell back
  to white — the award rows rendered white-on-white.
- `html.w-mod-js:not(.w-mod-ix) …` rules keep their `html` part, because those
  state classes are set by Webflow's runtime on `<html>` itself. They hold each
  element's pre-interaction state, so scoping them away caused a flash of
  finished content before the runtime booted.

**The motion** is Webflow's, not a reimplementation. The template's interactions
are IX2/IX3 data keyed to the `data-w-id` attributes the markup still carries, so
the runtime is vendored into `public/novasite/js` and loaded in order —
jQuery → two shared chunks → the page bundle. Two things it needs:

- `data-wf-page` on `<html>` (set in the root layout). Webflow keys page-scoped
  IX2 targets as `<pageId>|<elementId>` and reads that id from the attribute;
  without it those targets silently fail to resolve and every hover and reveal
  is inert.
- `window.gsap` / `ScrollTrigger` / `SplitText`. IX3 reaches for them as globals.
  This app already ships GSAP 3.15 — the version the template loads — so
  `NovasiteRuntime` publishes the existing instance rather than a second copy:
  one ticker, and one ScrollTrigger registry that Lenis is already driving.

The template's forms posted to the captured site's Webflow endpoint. Submits are
intercepted in the capture phase on an ancestor — which runs before the handler
Webflow binds to the form — validated, and resolved against a short delay, then
the template's own `.w-form-done` panel is shown. Nothing leaves the page.

Images were inlined as base64 in the capture (hence the 34MB `index.html`).
They're extracted to `public/novasite`; the ones stored as an SVG wrapping a
raster are re-rendered through a browser at 2×, which preserves the wrapper's
cover-crop and its declared intrinsic size — reading the inner bitmap directly
changed each card's aspect ratio and made the project section 65px too tall.

The site footer is suppressed on `/` (`AppShell`), since the clone ends in the
template's own.

**The copy is TITA's throughout**, taken from `src/data` and thisisthat.co.in.
Two slots had no TITA equivalent and were repurposed rather than invented:

- The template's **testimonials** are five named client quotes. TITA publishes
  none, and inventing quotes attributed to real clients was not an option, so
  that block now carries the studio's own manifesto and philosophy — its real
  published words — under the heading *what we believe*. Swap in genuine
  testimonials when there are some.
- The template's **awards** table lists four prizes. TITA has no press index
  (`awards.ts` is empty), so the section is now *four pillars* — Art, Strategy,
  Technology, Performance, the disciplines the studio actually leads with.

Two strings needed a CSS accommodation, kept in `novasite-tita.css` so the
generated `novasite.css` stays regenerable: the studio's email is eight
characters longer than the template's placeholder and clipped out of the CTA
below ~1264px, and the footer marquee token contains spaces where the
template's did not, so it wrapped onto three lines.

Verified section by section against the template rendered from the zip: at
1440×900 all ten sections match in height exactly, with mean per-pixel deltas of
1.1–3.6/255 — the two counter-running CTA marquees and the footer marquee differ
only in animation phase. At 390×844 every section matches but `about`, which is
1px shorter.

### The hero lens

The bubble that follows the cursor over the headline and swaps the words under it.

The reference renders its headline into the canvas twice — English and a second
script — and floats a PixiJS BulgePinch + RGBSplit bubble over it (recovered
values: radius 960, red `[-2,2]`, blue `[2,-2]`). Here both layers are English:
the proposition, with the studio's own name revealed underneath —
*This Is That / Agency / Indore & Ahmedabad*. The revealed line is set in the
headline face and shrunk only if it would run wider than the line it stands in
for, so the copy can be changed freely without spilling out of the bubble.

Here it's a single shader instead of two chained filters: one pass, exact control
over the glass rim, and the English can be masked out inside the bubble without
mask gymnastics. Both text layers are painted into offscreen 2D canvases at the
**real DOM headline's** measured line boxes, font and size, so the canvas copy
lands exactly on the markup it replaces.

Unlike the reference — which deletes its DOM headline outright — the real `<h1>`
stays in the document and only stops painting once the canvas is confirmed
drawing. A WebGL failure leaves real text on screen, and assistive tech and
crawlers always see it.

**One Lenis instance**, in `SmoothScrollProvider`. Lenis owns the scroll position
and pumps `ScrollTrigger.update()` from its own callback; GSAP's ticker drives
Lenis' rAF. Wiring it in that order is what keeps scrubbed timelines in lockstep
with the smoothed position rather than one frame behind.

**WebGL budget.** At most three live contexts at any moment: the page gradient, the
transition curtain, and — only on Team, and only once it scrolls into view — the
studio gallery. Every renderer caps DPR at 2 (1.5 on mobile), pauses its rAF loop
on `visibilitychange`, and destroys its context on unmount. Verified stable across
two full laps of the site with no context loss.

**WebGL is used where the effect needs it, not everywhere.** `PixiGallery` needs a
displacement crossfade, so it gets a context. `CircleMaskImage` gets an animated
`clip-path` — the Work grid mounts 34 of them at once and this keeps the reveal on
the compositor. `PixiImage` is `next/image` plus GSAP: it takes part in no
distortion effect, so a GPU texture would cost memory and buy nothing.

**Cleanup.** Every animated component wraps its tweens in `gsap.context()` and
reverts on unmount. The custom cursor drives position through `gsap.quickTo` so a
pointer move never touches React state.

**Pixi teardown is guarded.** `Application.destroy()` is not idempotent, and
destroying one whose `init()` never finished throws `this._cancelResize is not a
function` from the resize plugin. Thrown inside a React cleanup, that unmounts the
entire tree — it blanked the home page on the second visit. Every teardown now
goes through a guarded helper.

---

## Two CSS pitfalls worth knowing about

Both of these fail *silently* — no error, just wrong layout — so they're documented
rather than only fixed:

**1. Next serves the global stylesheet after CSS Modules.** At equal specificity the
global wins. So the `t-*` layer sets no `display`: it styles type, components style
boxes. A `display` in `.t-btn` outranked `Header.module.scss` and un-hid the desktop
burger on mobile. For the same reason `.t-list` and `.t-quote` use logical longhands
(`margin-block`, `padding-inline-start`) — a `margin: 0` shorthand there wipes the
`offset-*` off any element carrying both classes, and `.container`'s `padding`
shorthand did the same to component padding.

**2. GSAP stacks `yPercent` on top of an existing CSS transform.** A resting
`transform: translateY(-100%)` gets parsed into GSAP's `y` in pixels, and `yPercent`
is then added to it — so an element tweened to `yPercent: 0` finishes one full height
off-screen. The nav panel and the transition curtain both hit this. GSAP now owns
those transforms outright; `visibility: hidden` covers the pre-JS frame.

Related: `body` uses `overflow-x: clip`, not `hidden`. `hidden` makes `<body>` a
scroll container, which silently breaks every `position: sticky` descendant — which
on this site is the Work filter rail, both Contact columns, and eight section labels.

---

## Accessibility

- Semantic landmarks, skip link, visible focus rings throughout.
- Fullscreen menu is a `role="dialog"` with a focus trap, Escape-to-close, `inert`
  when closed, and focus restored to the opener.
- The custom cursor is disabled on touch and under reduced motion; every hover
  effect has a non-hover path.
- Form fields have real labels, `aria-invalid`, `aria-describedby` error links, and
  focus moves to the first invalid field on submit.
- World clocks render fixed-width placeholders server-side and fill in after mount —
  a real clock during SSR is a guaranteed hydration mismatch, and the placeholder is
  the same width so nothing shifts.
- **Reduced motion** is honoured properly: native scrolling instead of Lenis, no
  cursor, gradients render but stop animating, and all scroll-revealed content is
  visible at rest (verified: 0 hidden elements in view).

---

## Deliberate deviations

**One typeface pairing, above and below the hero.** The site is set in the
Novasite build's own faces — **Clash Display** for display type, **Inter Tight**
for body — so the pages read as one thing rather than two. Clash Display is
declared in `src/styles/_fonts.scss` from the six `.otf` files vendored to
`public/novasite/fonts`, the same files `novasite.css` loads for its own scope,
so the browser fetches each once and the type is identical on both sides. Inter
Tight comes through `next/font/google` in the root layout, self-hosted at build
time. The earlier Roobert/Hanken Grotesk pairing, inherited from the monopo
reference, is gone.

Two consequences worth knowing. Clash Display stops at Bold, but the type scale
asks for 800 in a dozen places, so the Bold face claims `font-weight: 700 900`
rather than letting the browser synthesise one. And Clash Display ships no
italic, so the `o`/`i` motif in `MonopoText` renders as a synthetic oblique —
it suits the geometric letterforms, but it is not a drawn italic.

**Everything measures against the lens host, never the viewport.** The text
texture is mapped onto the hero-sized layer the WebGL canvas is stretched over,
so a viewport-relative measurement is wrong by exactly `scrollY` the moment the
page moves. Getting that wrong put the bubble somewhere other than under the
cursor once scrolled, and threw the painted headline upward whenever a repaint
(a webfont resolving, a `--vh` change) landed after a scroll. Both the line
geometry and the pointer are now host-relative; the host's box is cached and
re-read on scroll and resize rather than measured per pointer event.

**The custom cursor is additive, and the native one stays.** An earlier pass hid
the OS cursor via `cursor: none`, which left the hero with no cursor at all. The
reference's stylesheet contains no `cursor: none` anywhere — the disc appears over
interactive targets *on top of* the real pointer. Fixed to match.

**The headline is canvas on desktop, DOM everywhere else.** See "The hero lens"
above: the DOM `<h1>` is always present and only stops painting once the canvas is
confirmed drawing. On touch and under reduced motion the lens never mounts and the
DOM text is what you see.

**`/work/[slug]` is an extrapolation.** TITA publishes no per-client case study,
so this is built from the portfolio data that does exist — client, collection and
service tags — chiefly so all 26 cards resolve. Three sections link here. All 26
prerender at build time.

**Three client logos 404 on TITA's own server** (`ahilya`, `davesmen`, `nuvae`) —
their live site shows alt text for them too. `ClientMark` falls back to the
client's name set as a wordmark rather than shipping a broken image.

**The portfolio shows a project thumbnail with the client's mark as a badge.** That is how TITA
presents its own work; the studio does not publish per-project imagery.

**The client roster is the zip's, not the website's.** `website_project_thumbnails.zip`
ships one numbered thumbnail per client — 26 of them, matching the 26 marks in
`/images/clients` exactly. thisisthat.co.in/work still lists an older roster of
38 with placeholder names (`Solar EV` for Vayve Mobility, `Dream Villa Goa` for
Go Goa Holiday Homes, `Trikaal` for Hotel The Trikaay) and several entries whose
logo 404s, so `projects.ts` follows the zip wherever the two disagree. Each
client carries a one-line description and a link to its own site, researched
from the open web; six could not be confirmed and carry no link — they render as
plain text rather than a dead link. See the NEEDS CONFIRMATION comments in
`src/data/projects.ts`.

**The contact form has no backend.** Validation, all five states and focus management
are real; `submit` resolves against a mocked delay. Swap it for a POST and nothing
else needs to change.

**`full home .zip`** is the "Novasite" Webflow template, and the whole home page
below the hero is a verbatim clone of it — markup, stylesheet, images and its own
Webflow interaction runtime — carrying TITA's copy. See *Home page* above for
what that involved.

---

## Verified

Automated Playwright pass over every route at 1440×900, 1024×768 and 390×844:

- No console errors, no page errors, no 404s, no hydration warnings
- No horizontal overflow at any breakpoint
- Menu open/close/Escape, focus trap, page transitions, Work filtering
  (34 → 10 on *Digital*), studio gallery stepping
- **Two full laps of all five routes** with canvas count stable (3 on home, 2 on
  most pages, 4 on contact) and zero `webglcontextlost` events
- Collection filtering (26 → 4 on *Amplify*), and every referenced asset path
  checked to exist on disk
- Reduced-motion pass: Lenis off, lens never mounts, all content visible at rest

---

## Layout

```
src/
  app/            routes: / · /work · /work/[slug] · /services · /team · /contact
  components/
    core/         AppShell · SmoothScrollProvider · PageTransition · Preloader
                  CustomCursor · TransitionLink · CookieNotice
    navigation/   Header · Navigation · WorldClocks
    webgl/        MonopoGradient(+Renderer) · gradient.glsl · PixiGallery
                  PixiImage · CircleMaskImage
    ui/           MonopoText · Logo · Ruler · ScrollCue · ParallaxObject · IntroGradient
    home/         HomeHero · HeroLens(+lens.glsl) · RecentWork · HomeGradientContext
                  Manifesto · WorkProcess · HomeServices · Philosophy
                  ClientBand · CtaMarquee
    work/ services/ team/ contact/ footer/
  data/           site · projects · team · services · awards · gradients
  lib/            gsap · animations · motion
  styles/         globals · _variables · _mixins · _grid · _typography · _forms · _fonts
```
