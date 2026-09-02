/**
 * MonopoGradient shaders.
 *
 * This is the reference site's own gradient program, recovered from the live
 * page by intercepting `WebGLRenderingContext.shaderSource` — not an
 * approximation of it. The maths below is theirs; the comments are mine.
 *
 * How it works, because it is not the fBm-warp you'd expect from the look:
 *
 *   1. Screen position is aspect-corrected, divided by `zoom`, offset by
 *      `transformPosition`.
 *   2. A 3D gradient noise *with analytic derivatives* (Inigo Quilez) is sampled
 *      at (position, seed). Its derivative vector — not its value — displaces
 *      the position by `displacement`. That is what makes the colour sheets
 *      flow rather than sit in bands.
 *   3. The displaced position is tiled with `mod(p - spacing, spacing*2) - spacing`,
 *      rotated by `colorRotation`, scaled by `colorSize` and squashed on X by
 *      `colorSpread`.
 *   4. The four colours are laid down as *distance fields* from four horizontal
 *      lines at y = ±colorSpacing*1.5 and ±colorSpacing*0.5. Each `mix` paints
 *      its colour where the distance is under 1 and leaves the previous colour
 *      beyond it.
 *   5. A cheap value-noise grain is added at `noiseIntensity` — this is the
 *      film grain that gives the whole site its texture.
 */

export const VERTEX = /* glsl */ `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vPosition;

void main() {
  // Full-screen quad straight in clip space; vPosition is -1..1, as the
  // reference's own vertex shader does it.
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vPosition = aPosition;
}
`

export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform vec3  color1;
uniform vec3  color2;
uniform vec3  color3;
uniform vec3  color4;
uniform float colorSize;
uniform float colorSpacing;
uniform float colorRotation;
uniform float colorSpread;
uniform float displacement;
uniform float zoom;
uniform float spacing;
uniform float seed;
uniform vec2  viewportSize;
uniform vec2  colorOffset;
uniform vec2  transformPosition;
uniform float noiseSize;
uniform float noiseIntensity;
uniform float uAlpha;

in vec2 vPosition;
out vec4 fragColor;

// ── Gradient noise 3D with derivatives — Inigo Quilez, MIT ──────────────────
// https://iquilezles.org/articles/gradientnoise/
vec3 gradientDerivativesNoise3DHash( vec3 p ) {
  p = fract(p * vec3(.1031, .1030, .0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

// returns value noise (in x) and its derivatives (in yzw)
vec4 gradientDerivativesNoise3D( in vec3 x ) {
  vec3 p = floor(x);
  vec3 w = fract(x);

  // quintic interpolant
  vec3 u = w * w * w * (w * (w * 6.0 - 15.0) + 10.0);
  vec3 du = 30.0 * w * w * (w * (w - 2.0) + 1.0);

  vec3 ga = gradientDerivativesNoise3DHash( p+vec3(0.0,0.0,0.0) );
  vec3 gb = gradientDerivativesNoise3DHash( p+vec3(1.0,0.0,0.0) );
  vec3 gc = gradientDerivativesNoise3DHash( p+vec3(0.0,1.0,0.0) );
  vec3 gd = gradientDerivativesNoise3DHash( p+vec3(1.0,1.0,0.0) );
  vec3 ge = gradientDerivativesNoise3DHash( p+vec3(0.0,0.0,1.0) );
  vec3 gf = gradientDerivativesNoise3DHash( p+vec3(1.0,0.0,1.0) );
  vec3 gg = gradientDerivativesNoise3DHash( p+vec3(0.0,1.0,1.0) );
  vec3 gh = gradientDerivativesNoise3DHash( p+vec3(1.0,1.0,1.0) );

  float va = dot( ga, w-vec3(0.0,0.0,0.0) );
  float vb = dot( gb, w-vec3(1.0,0.0,0.0) );
  float vc = dot( gc, w-vec3(0.0,1.0,0.0) );
  float vd = dot( gd, w-vec3(1.0,1.0,0.0) );
  float ve = dot( ge, w-vec3(0.0,0.0,1.0) );
  float vf = dot( gf, w-vec3(1.0,0.0,1.0) );
  float vg = dot( gg, w-vec3(0.0,1.0,1.0) );
  float vh = dot( gh, w-vec3(1.0,1.0,1.0) );

  return vec4(
    va + u.x*(vb-va) + u.y*(vc-va) + u.z*(ve-va) + u.x*u.y*(va-vb-vc+vd) + u.y*u.z*(va-vc-ve+vg) + u.z*u.x*(va-vb-ve+vf) + (-va+vb+vc-vd+ve-vf-vg+vh)*u.x*u.y*u.z,
    ga + u.x*(gb-ga) + u.y*(gc-ga) + u.z*(ge-ga) + u.x*u.y*(ga-gb-gc+gd) + u.y*u.z*(ga-gc-ge+gg) + u.z*u.x*(ga-gb-ge+gf) + (-ga+gb+gc-gd+ge-gf-gg+gh)*u.x*u.y*u.z +
    du * (vec3(vb,vc,ve) - va + u.yzx*vec3(va-vb-vc+vd,va-vc-ve+vg,va-vb-ve+vf) + u.zxy*vec3(va-vb-ve+vf,va-vb-vc+vd,va-vc-ve+vg) + u.yzx*u.zxy*(-va+vb+vc-vd+ve-vf-vg+vh))
  );
}

float hash(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

float computeNoise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

void main() {
  vec2 position = vPosition;
  position.x *= min(1., viewportSize.x / viewportSize.y);
  position.y *= min(1., viewportSize.y / viewportSize.x);
  position /= zoom;
  position += transformPosition;

  vec2 noiseLocalPosition = position * .5 + .5;
  vec3 displacementNoise = gradientDerivativesNoise3D(vec3(noiseLocalPosition, seed)).xyz;

  float noise = computeNoise(vPosition * viewportSize / noiseSize);

  position += displacementNoise.xz * displacement;

  vec2 offsetedPosition = position;
  offsetedPosition -= colorOffset;
  offsetedPosition = mod(offsetedPosition - spacing, vec2(spacing * 2.)) - spacing;
  offsetedPosition = rotate(offsetedPosition, -colorRotation);
  offsetedPosition /= vec2(colorSize, colorSize);
  offsetedPosition *= vec2(1. / colorSpread, 1.);

  vec3 color = vec3(0.);
  color = mix(color1, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., colorSpacing * 1.5))));
  color = mix(color2, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., colorSpacing * .5))));
  color = mix(color3, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., -colorSpacing * .5))));
  color = mix(color4, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., -colorSpacing * 1.5))));

  color += noise * noiseIntensity;
  color = clamp(color, 0., 1.);

  fragColor = vec4(color, 1.) * uAlpha;
}
`
