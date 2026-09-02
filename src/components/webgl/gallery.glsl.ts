/** Displacement crossfade used by `PixiGallery` (`c-PixiGallery`). */

export const GALLERY_VERTEX = /* glsl */ `#version 300 es
precision highp float;

in vec2 aPosition;
in vec2 aUV;

out vec2 vUV;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

void main(void) {
  mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
  gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
  vUV = aUV;
}
`

export const GALLERY_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUV;
out vec4 finalColor;

uniform sampler2D uTextureFrom;
uniform sampler2D uTextureTo;

uniform float uProgress;
uniform float uStrength;
uniform float uDirection;   // +1 = next, -1 = previous
uniform vec2  uCoverFrom;   // object-fit: cover scale factors
uniform vec2  uCoverTo;

// Cheap value noise — enough texture to break the wipe into a liquid edge.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec2 cover(vec2 uv, vec2 scale) {
  return (uv - 0.5) / scale + 0.5;
}

void main(void) {
  float n = noise(vUV * 6.0) - 0.5;

  // Each frame is pushed the opposite way, so the two images slide past each
  // other through a noisy seam instead of simply cross-dissolving.
  vec2 offset = vec2(uDirection, 0.0) * uStrength;

  vec2 uvFrom = cover(vUV + offset * uProgress * (0.6 + n), uCoverFrom);
  vec2 uvTo   = cover(vUV - offset * (1.0 - uProgress) * (0.6 + n), uCoverTo);

  vec4 from = texture(uTextureFrom, clamp(uvFrom, 0.001, 0.999));
  vec4 to   = texture(uTextureTo,   clamp(uvTo,   0.001, 0.999));

  float mixer = smoothstep(0.0, 1.0, uProgress + n * 0.25);

  finalColor = mix(from, to, mixer);
}
`
