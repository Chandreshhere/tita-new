/**
 * Gradient configurations.
 *
 * Every value here is the reference site's own — the page heroes come from the
 * `<monopo-gradient>` elements in the captured HTML, and the 34 per-project
 * palettes come from the live Prismic payload (`_nuxt/static/.../state.js`),
 * which is what drives the background as the home page's project stack scrolls.
 *
 * Field names map 1:1 onto uniforms in `components/webgl/gradient.glsl.ts`.
 */
export type GradientConfig = {
  color1: string
  color2: string
  color3: string
  color4: string
  colorSize: number
  colorSpacing: number
  colorRotation: number
  colorSpread: number
  colorOffset: [number, number]
  displacement: number
  seed: number
  position: [number, number]
  zoom: number
  spacing: number
}

/** Home hero — navy into cyan with the signature orange flare. */
export const HOME_GRADIENT: GradientConfig = {
  color1: '#16254b', color2: '#23418a', color3: '#aadfd9', color4: '#e64f0f',
  colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
  colorSpread: 4.52, displacement: 4.66, seed: -0.06,
  colorOffset: [-0.7741174697875977, -0.20644775390624992],
  position: [-0.2816110610961914, -0.43914794921875],
  zoom: 0.72, spacing: 4.27,
}

/** Services hero — sand, orange, crimson, near-black. */
export const SERVICES_GRADIENT: GradientConfig = {
  color1: '#f5e1a4', color2: '#ee7f27', color3: '#bc162a', color4: '#231a1c',
  colorSize: 0.58, colorSpacing: 0.52, colorRotation: -0.381592653589793,
  colorSpread: 4.52, displacement: 4.406785051753612, seed: -0.7390999246539559,
  colorOffset: [-0.7741174697875977, -0.20644775390624992],
  position: [-0.2816110610961914, -0.43914794921875],
  zoom: 0.72, spacing: 4.27,
}

/** Team hero — blues into violet. */
export const TEAM_GRADIENT: GradientConfig = {
  color1: '#47AFFF', color2: '#5E68E8', color3: '#4D24AE', color4: '#3957C0',
  colorSize: 0.58, colorSpacing: 0.52, colorRotation: -0.381592653589793,
  colorSpread: 4.52, displacement: 4.430918482001753, seed: -0.31243450288919594,
  colorOffset: [-0.7741174697875977, -0.20644775390624992],
  position: [-0.2816110610961914, -0.43914794921875],
  zoom: 0.72, spacing: 4.27,
}

/** Work hero — the home palette at a different seed. */
export const WORK_GRADIENT: GradientConfig = {
  color1: '#16254b', color2: '#23418a', color3: '#aadfd9', color4: '#e64f0f',
  colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
  colorSpread: 4.52, displacement: 4.12, seed: 0.2143,
  colorOffset: [-0.7741174697875977, -0.20644775390624992],
  position: [-0.2816110610961914, -0.43914794921875],
  zoom: 0.72, spacing: 4.27,
}

/**
 * The route-transition palette (`c-AppTransition-canvas`). The reference reuses
 * one warm palette for every transition and varies only displacement + seed per
 * route, which is what keeps successive transitions from looking identical.
 */
const TRANSITION_BASE = {
  color1: '#9A4D33', color2: '#FEA900', color3: '#FEA900', color4: '#9BC99B',
  colorSize: 0.0, colorSpacing: 0.52, colorRotation: -0.381592653589793,
  colorSpread: 4.52,
  colorOffset: [-0.7741174697875977, -0.20644775390624992] as [number, number],
  position: [-0.2816110610961914, -0.43914794921875] as [number, number],
  zoom: 0.72, spacing: 4.27,
}

export const TRANSITION_GRADIENTS: Record<string, GradientConfig> = {
  '/': { ...TRANSITION_BASE, displacement: 4.66, seed: -0.06 },
  '/work': { ...TRANSITION_BASE, displacement: 4.66, seed: 0.42 },
  '/services': { ...TRANSITION_BASE, displacement: 5, seed: 0.7 },
  '/team': { ...TRANSITION_BASE, displacement: 4, seed: -0.3 },
  '/contact': { ...TRANSITION_BASE, displacement: 4, seed: 0.7 },
}

export const CONTACT_GRADIENT: GradientConfig = TRANSITION_GRADIENTS['/contact']

export const PAGE_GRADIENTS: Record<string, GradientConfig> = {
  '/': HOME_GRADIENT,
  '/work': WORK_GRADIENT,
  '/services': SERVICES_GRADIENT,
  '/team': TEAM_GRADIENT,
  '/contact': CONTACT_GRADIENT,
}

/**
 * Per-project palettes, keyed by slug, straight from the CMS payload. The home
 * page morphs the background into each of these as its project stack scrolls —
 * the reference's most distinctive scroll behaviour.
 */
export const PROJECT_GRADIENTS: Record<string, GradientConfig> = {
  'barbour-wallace-gromit-christmas': {
    color1: '#023A15', color2: '#023A15', color3: '#023A15', color4: '#e3dc92',
    colorSize: 2.23, colorSpacing: 0.72, colorRotation: 1.32840734641021,
    colorSpread: 0.64, displacement: 0.0, seed: -0.64,
    colorOffset: [0.3999999999999999, 0.041999969482421906],
    position: [-1.3511557840265052, -0.20119179811405385],
    zoom: 0.69, spacing: 4.27,
  },
  'astrox-99-launch-campaign': {
    color1: '#A31706', color2: '#C24C19', color3: '#59923A', color4: '#125122',
    colorSize: 0.89, colorSpacing: 0.58, colorRotation: -0.121592653589793,
    colorSpread: 1.26, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.06406299469556291, -0.18572697042878902],
    zoom: 1.1290077959520886, spacing: 4.27,
  },
  'nkora-coffee': {
    color1: '#A25028', color2: '#A25028', color3: '#476217', color4: '#FEF5B3',
    colorSize: 0.89, colorSpacing: 0.58, colorRotation: -0.121592653589793,
    colorSpread: 1.26, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.06406299469556291, -0.18572697042878902],
    zoom: 1.1290077959520886, spacing: 4.27,
  },
  'yonex-players-lounge-paris': {
    color1: '#A1CFEB', color2: '#CBE3F3', color3: '#CBE3F3', color4: '#567DAB',
    colorSize: 0.89, colorSpacing: 0.58, colorRotation: -0.121592653589793,
    colorSpread: 1.26, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.06406299469556291, -0.18572697042878902],
    zoom: 1.1290077959520886, spacing: 4.27,
  },
  'yonex-viktor-axelsen-collection-launch-campaign': {
    color1: '#ffffff', color2: '#ffffff', color3: '#ffffff', color4: '#c3e649',
    colorSize: 2.23, colorSpacing: 0.72, colorRotation: 1.32840734641021,
    colorSpread: 0.64, displacement: 0.0, seed: -0.64,
    colorOffset: [0.3999999999999999, 0.041999969482421906],
    position: [-1.3511557840265052, -0.20119179811405385],
    zoom: 0.69, spacing: 4.27,
  },
  'onitsuka-tiger-finish-line-cafe': {
    color1: '#E00022', color2: '#E00022', color3: '#E00022', color4: '#000000',
    colorSize: 0.89, colorSpacing: 0.58, colorRotation: -0.121592653589793,
    colorSpread: 1.26, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.06406299469556291, -0.18572697042878902],
    zoom: 1.1290077959520886, spacing: 4.27,
  },
  'yonex-all-england-athlete-clubhouse': {
    color1: '#1959A6', color2: '#1959A6', color3: '#01A6FC', color4: '#ffffff',
    colorSize: 0.89, colorSpacing: 0.58, colorRotation: -0.121592653589793,
    colorSpread: 1.26, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.06406299469556291, -0.18572697042878902],
    zoom: 1.1290077959520886, spacing: 4.27,
  },
  'barbour-icons-in-quilting': {
    color1: '#062C05', color2: '#1B6416', color3: '#ECB134', color4: '#412D07',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  '1337-world-building': {
    color1: '#54FCFC', color2: '#F19FDF', color3: '#F19FDF', color4: '#FFCD00',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'outfry-korean-fried-chicken-branding': {
    color1: '#F43516', color2: '#F43516', color3: '#FFFFFF', color4: '#6BBFED',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'kodama-capital': {
    color1: '#405B10', color2: '#BBB99D', color3: '#A79F47', color4: '#405B10',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'hotel-onitsuka-tiger': {
    color1: '#FFCD00', color2: '#FFCD00', color3: '#FFCD00', color4: '#000000',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'quest-portal-brand-universe': {
    color1: '#B44FF3', color2: '#B44FF3', color3: '#7d72ff', color4: '#000000',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'yonex-astrox-88-sd-launch-campaign': {
    color1: '#08122C', color2: '#659DB8', color3: '#659DB8', color4: '#08122C',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'yonex-athlete-lounge': {
    color1: '#0258A9', color2: '#0258A9', color3: '#0258A9', color4: '#FFFFFF',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'onitsuka-tiger-astro-boy': {
    color1: '#E9001E', color2: '#E9001E', color3: '#E9001E', color4: '#000000',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'yonex-all-england-brand-identity': {
    color1: '#00FF18', color2: '#00FF18', color3: '#3036FC', color4: '#3036FC',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'ghost-messaging-app-brand-identity': {
    color1: '#7C50FF', color2: '#7C50FF', color3: '#FF96D8', color4: '#45ABED',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'meridian-book': {
    color1: '#dbc349', color2: '#da4446', color3: '#4a9fd6', color4: '#34316a',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'mission-barns-cultivated-meat': {
    color1: '#F8EAE0', color2: '#D3752B', color3: '#D3752B', color4: '#5E0E0E ',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'babettesbranding': {
    color1: '#FF9718', color2: '#A43A2D', color3: '#A43A2D', color4: '#5080CE',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'arcfest-badminton-digital-festival': {
    color1: '#000000', color2: '#dbff00', color3: '#dbff00', color4: '#dbff00',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'yonex-arcsaber-11-launch-campaign': {
    color1: '#ea0407', color2: '#32383a', color3: '#32383a', color4: '#ea0407',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'tacos-padre-canned-cocktails': {
    color1: '#d2e4f4', color2: '#4eabe4', color3: '#f08833', color4: '#C04C35',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'presight-partners-website-branding': {
    color1: '#16254b', color2: '#87A3D1', color3: '#adc1f0', color4: '#F2EEE3',
    colorSize: 0.77, colorSpacing: 0.49, colorRotation: -0.571592653589793,
    colorSpread: 6.39, displacement: 3.48, seed: 0.3,
    colorOffset: [-0.24336674528301883, 0.21703125],
    position: [-0.020145440251572277, -0.25226562499999994],
    zoom: 0.8, spacing: 3.49,
  },
  'canada-goose-the-art-of-film-berlin-2021': {
    color1: '#595643', color2: '#4e6b66', color3: '#ed834e', color4: '#ebcc6e',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'we-are-third-website': {
    color1: '#a83807', color2: '#e7e1d2', color3: '#c98f61', color4: '#972e00',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'yonex-astrox-88sd-launch-campaign': {
    color1: '#854a32', color2: '#ec8209', color3: '#3d7f8a', color4: '#092734',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'super-dan-origin': {
    color1: '#fb6066', color2: '#fdd86e', color3: '#ffa463', color4: '#f66b40',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'lin-dan-x-yonex-the-memories-we-shared': {
    color1: '#aaa48b', color2: '#aaa48b', color3: '#fefeeb', color4: '#f8f4e4',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'ocha-jetro-japanese-green-tea': {
    color1: '#274A34', color2: '#A0BE7E', color3: '#D2DDA5', color4: '#274A34',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'musiversal-brand-identity-video': {
    color1: '#E33223', color2: '#ED6A3D', color3: '#B95B9F', color4: '#4F266A',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'cellular-agriculture-society-website': {
    color1: '#f7f0ba', color2: '#e0dba4', color3: '#a9cba6', color4: '#7ebea3',
    colorSize: 1.54, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
  'canada-goose-city-sense-urban-excursion-guides': {
    color1: '#1b325f', color2: '#9cc4e4', color3: '#e9f2f9', color4: '#d84322',
    colorSize: 0.75, colorSpacing: 0.52, colorRotation: -0.381592653589793,
    colorSpread: 4.52, displacement: 4.66, seed: -0.06,
    colorOffset: [-0.7741174697875977, -0.20644775390624992],
    position: [-0.2816110610961914, -0.43914794921875],
    zoom: 0.72, spacing: 4.27,
  },
}
