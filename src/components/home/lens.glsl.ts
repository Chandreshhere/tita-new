/**
 * Hero lens shader.
 *
 * The reference renders its headline into the Pixi canvas twice — once in
 * English, once in Japanese — and floats a bubble over it that magnifies the
 * Japanese copy through a bulge distortion with RGB split. Its own stack is
 * PixiJS's BulgePinchFilter + RGBSplitFilter (recovered from the live page:
 * radius 960, red [-2,2], green [1,1], blue [2,-2]).
 *
 * Doing it as one shader instead of two chained filters means a single pass and
 * exact control over the rim, and lets the English copy be masked out inside the
 * bubble without any mask gymnastics.
 */
export const LENS_VERTEX = /* glsl */ `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUV;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vUV = aPosition * 0.5 + 0.5;
}
`

export const LENS_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D uTextEn;
uniform sampler2D uTextJp;
uniform vec2  uResolution;
uniform vec2  uLens;        // lens centre, 0..1 in UV space
uniform float uRadius;      // lens radius, fraction of viewport height
uniform float uStrength;    // bulge magnification
uniform float uRgb;         // chromatic aberration, in UV units
uniform float uActive;      // 0..1 — lens fades in on pointer enter

in vec2 vUV;
out vec4 fragColor;

// The text layers are painted into 2D canvases, whose row 0 is the *top*, while
// GL's UV origin is bottom-left. Everything else here works in GL space, so the
// flip is confined to texture sampling.
vec2 tuv(vec2 uv) { return vec2(uv.x, 1.0 - uv.y); }

void main() {
  // Work in aspect-corrected space so the bubble stays circular.
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (vUV - uLens) * aspect;
  float d = length(p);
  float r = uRadius;

  vec4 en = texture(uTextEn, tuv(vUV));

  if (uActive < 0.001 || d > r) {
    fragColor = en;
    return;
  }

  // Bulge: pull samples toward the centre, strongest in the middle and easing
  // off to nothing at the rim so there is no hard seam.
  float t = d / r;
  float bulge = 1.0 - uStrength * (1.0 - t * t);
  vec2 warped = uLens + (p * bulge) / aspect;

  // Chromatic split along the radial direction — the fringing is strongest at
  // the edge of the bubble, as with a real lens.
  vec2 dir = d > 0.0001 ? normalize(p) / aspect : vec2(0.0);
  float ca = uRgb * t;

  float jr = texture(uTextJp, tuv(warped + dir * ca)).r;
  float jg = texture(uTextJp, tuv(warped)).g;
  float jb = texture(uTextJp, tuv(warped - dir * ca)).b;
  float ja = max(max(
      texture(uTextJp, tuv(warped + dir * ca)).a,
      texture(uTextJp, tuv(warped)).a),
      texture(uTextJp, tuv(warped - dir * ca)).a);

  vec4 jp = vec4(jr, jg, jb, ja);

  // Soft edge so the English fades back in across a few pixels.
  float edge = smoothstep(r, r * 0.86, d);

  // Glass rim: a faint bright ring just inside the boundary, plus an overall
  // lift so the bubble reads as a physical object over the gradient.
  float rim = smoothstep(r * 0.90, r * 0.985, d) * (1.0 - smoothstep(r * 0.985, r, d));
  float sheen = (1.0 - smoothstep(0.0, r, d)) * 0.05;

  vec4 col = mix(en, jp, edge * uActive);
  col.rgb += (rim * 0.35 + sheen) * uActive;
  col.a = max(col.a, (rim * 0.35 + sheen) * uActive);

  fragColor = col;
}
`
