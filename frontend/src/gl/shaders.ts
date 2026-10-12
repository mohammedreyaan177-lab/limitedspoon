/**
 * Rain-on-glass fragment shader.
 *
 * Modelled on `data/Glass.jpg` (733x418): dense fine condensation, discrete
 * beads with a bright top-lit crescent, a darker lower rim, and irregular
 * vertical runnels where water has already slid down.
 *
 * Written against GLSL ES 1.00 so one source runs on WebGL1 and WebGL2.
 *
 * Realism notes, because "a few circles" is the thing this is replacing:
 *
 *  - A droplet on glass is a *ball lens*, not a sphere of paint. It shows a
 *    minified, INVERTED view of what is behind it. `lensUV` below flips the
 *    sample point about the bead's own centre and shrinks it, which is what
 *    produces the upside-down sliver of background real drops show.
 *  - One dominant specular, not a ring. A bead's rim is bright on the side
 *    facing the light and dark everywhere else; a uniform rim reads as soap
 *    bubble, which is the single most common tell of fake rain.
 *  - Light entering a drop concentrates at the lower inner wall. `caustic`
 *    puts a small bright crescent there, opposite the highlight.
 *  - Beads are not circular. `shapeAniso` squashes each one into an ellipse
 *    and stretches a minority into teardrops, because surface tension on a
 *    vertical pane produces elongated drops far more often than round ones.
 *  - Heights and their analytic gradients are accumulated, so the surface
 *    normal is exact rather than estimated with finite differences. Each
 *    lattice column falls at its own hashed rate, which is what reads as
 *    rivulets instead of a synchronised sheet.
 */

export const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform float uAspect;
uniform float uCellPx;
uniform float uIntensity;
uniform float uSpeed;
uniform vec3  uDeep;
uniform vec3  uMid;
uniform vec3  uHaze;
uniform vec3  uSpecular;

varying vec2 vUv;

const float TAU = 6.28318530718;

/* ---------------------------------------------------------------- hashing */

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}

/* ------------------------------------------------------------- the water */

/* Per-bead shape. Returns an anisotropy in cell units.
   The downward stretch is deliberately mild: pushed past ~1.25 the beads stop
   reading as droplets on a pane and start reading as tadpoles. Real drops
   elongate only slightly before they run. */
vec2 shapeAniso(float rnd) {
  float squash = mix(0.86, 1.05, hash11(rnd * 91.7));
  float stretch = rnd > 0.70 ? mix(1.02, 1.24, hash11(rnd * 37.3)) : 1.0;
  return vec2(1.0 / squash, squash * stretch);
}

/* Spherical cap with anisotropic radius. Adds height and its exact gradient.
   The dom* params track the bead this pixel sits deepest inside, in PIXEL
   space, so the shading pass can use it as a ball lens regardless of which
   layer it came from (each layer has its own cell size). */
void bead(inout float h, inout vec2 g,
          vec2 p, vec2 c, float r, float amp, float cellPx,
          inout float domH, inout vec2 domC, inout float domR) {
  vec2 an = shapeAniso(hash21(c * 0.37 + 3.1));
  vec2 d = (p - c) / an;
  float dd = dot(d, d);
  float r2 = r * r;
  if (dd >= r2) return;

  float s = sqrt(max(r2 - dd, 0.0));
  float contrib = amp * s;
  h += contrib;

  // chain rule through the anisotropy
  g += (amp * (-d / an)) / max(s, 1e-3);

  if (contrib > domH) {
    domH = contrib;
    domC = c * cellPx;   // lattice units -> pixels
    domR = r * cellPx;
  }
}

/* A runnel: the wet column a bead drags above itself as it slides down.
   The centreline wanders and the column thins toward its tail, because a
   straight constant-width bar is what makes CG rain look like matchsticks. */
void runnel(inout float h, inout vec2 g, vec2 p, float cx, float top, float len,
            float w, float amp, float seed) {
  float bot = top - len;
  if (p.y > top + w || p.y < bot - w) return;

  float t01 = clamp((top - p.y) / max(len, 1e-3), 0.0, 1.0);

  float ymask = smoothstep(bot - w, bot + w, p.y) *
                (1.0 - smoothstep(top - w * 0.7, top + w * 0.7, p.y));

  // older water at the tail has spread and thinned
  ymask *= 1.0 - 0.55 * t01;
  ymask *= 0.62 + 0.38 * vnoise(vec2(seed, p.y * 3.1));

  float cxw = cx + (vnoise(vec2(seed * 1.7, p.y * 2.2)) - 0.5) * w * 2.4 * (0.25 + t01);

  float off = p.x - cxw;
  float u = clamp(abs(off) / max(w, 1e-3), 0.0, 1.0);
  float prof = sqrt(max(1.0 - u * u, 0.0));
  if (prof <= 0.0) return;

  h += prof * ymask * amp;

  float dprof = -u / max(prof, 1e-3);
  g.x += dprof * ymask * amp * sign(off) / max(w, 1e-3) * 0.5;
  g.y += (ymask * amp) * 0.45 * (vnoise(vec2(cx * 11.0, p.y * 9.0)) - 0.5);
}

/* One falling layer of beads on a square lattice measured in device pixels, so
   a droplet keeps the same physical size from a 320px phone to a 4K monitor. */
void fallingLayer(vec2 px, float t, float cellPx, float fallRate, float seed,
                  float sizePow, float minSize, float maxSize,
                  float keepProb, float runnelAmp, float runnelLen,
                  inout float h, inout vec2 g,
                  inout float domH, inout vec2 domC, inout float domR) {
  vec2 q = px / max(cellPx, 1e-3);

  float col = floor(q.x);

  // per-column speed: 0.5x .. 2.0x the layer rate
  float cs = mix(0.5, 2.0, hash11(col * 1.7317 + seed * 7.13));
  q.y += t * fallRate * cs;

  float row0 = floor(q.y);

  for (int i = 0; i < 2; i++) {
    float row = row0 + float(i);
    vec2 cell = vec2(col, row);
    vec2 rnd = hash22(cell + seed);
    float rnd2 = hash21(cell * 1.37 + seed * 3.11);

    float sz = mix(minSize, maxSize, pow(rnd2, sizePow));

    // uneven coverage: some stretches of glass stay clearer than others
    float cover = fbm(vec2(cell.x * 0.22, cell.y * 0.17) + seed);
    if (rnd.x > keepProb * (0.30 + cover * 0.9)) continue;

    vec2 c = cell + vec2(0.5 + (rnd.x - 0.5) * 0.66,
                         0.5 + (rnd.y - 0.5) * 0.66);

    // slow wander, as if surface tension keeps nudging the bead
    c.x += sin(t * 0.55 + rnd2 * TAU) * 0.04;
    c.y += cos(t * 0.41 + rnd.y * TAU) * 0.03;

    float amp = sz * 2.6;
    bead(h, g, q, c, sz, amp, cellPx, domH, domC, domR);

    // A minority of beads have started to run. Lengths vary by more than 5x and
    // most trails are faint, because trails of near-identical length attached
    // to near-identical beads is exactly what makes procedural rain look like
    // a field of pins.
    if (rnd2 > 0.86 && runnelAmp > 0.0) {
      float len = mix(0.35, 3.6, rnd.y * rnd.y) * runnelLen;
      runnel(h, g, q, c.x, c.y + sz * 0.22, len, sz * 0.17,
             runnelAmp * sz * 0.95, rnd2 * 40.0);
    }
  }
}

/* Condensation: dense, fine, essentially static. The fog between the beads.

   These are too small for the bead specular to catch them -- their normals
   barely tilt, so pow(ndl, 52) is ~0 and they render as nothing. So their
   height is returned separately and used to scatter light into a fine grain,
   which is what actually reads as condensation on a pane. */
void condensation(vec2 px, float seed, float cellPx, float amp,
                  inout float h, inout vec2 g, out float mist) {
  mist = 0.0;
  vec2 q = px / max(cellPx, 1e-3);
  vec2 cell = floor(q);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 id = cell + vec2(float(x), float(y));
      vec2 rnd = hash22(id + seed);
      float rnd2 = hash21(id * 2.11 + seed);
      if (rnd2 > 0.72) continue;
      float r = mix(0.14, 0.46, rnd2 / 0.72);
      vec2 c = id + vec2(0.2 + rnd.x * 0.6, 0.2 + rnd.y * 0.6);
      vec2 d = q - c;
      float dd = dot(d, d);
      float r2 = r * r;
      if (dd < r2) {
        float s = sqrt(max(r2 - dd, 0.0));
        float contrib = amp * r * 2.4 * s;
        h += contrib;
        g += (amp * r * 2.4) * (-d) / max(s, 1e-3);
        mist += contrib;
      }
    }
  }
}

/* ------------------------------------------------------------- the backdrop */

/* What you see through the pane. Derived from the reference's palette rather
   than sampled from the photo, so no static streak in the source can be
   mistaken for moving water. */
vec3 interior(vec2 uv) {
  float v = uv.y;
  vec3 col = mix(uDeep, uMid, smoothstep(-0.25, 0.50, v));
  col = mix(col, uHaze, smoothstep(0.42, 1.20, v) * 0.72);

  float bands = 0.0;
  bands += smoothstep(0.26, 0.0, abs(uv.x - 0.20)) * 0.50;
  bands += smoothstep(0.22, 0.0, abs(uv.x - 0.52)) * 0.38;
  bands += smoothstep(0.17, 0.0, abs(uv.x - 0.78)) * 0.26;
  bands *= smoothstep(1.10, 0.10, v);
  col += uHaze * bands * 0.20;

  // the pane falls away into shadow toward the bottom and the frame, which is
  // what gives the drops something to read against
  vec2 d = (uv - 0.5) * vec2(uAspect, 1.0);
  col *= 1.0 - smoothstep(0.22, 1.05, length(d)) * 0.70;
  return col;
}

/* -------------------------------------------------------------------- main */

void main() {
  vec2 uv = vUv;
  vec2 centred = (uv - 0.5) * vec2(uAspect, 1.0);
  float t = uTime * uSpeed;

  vec2 px = uv * uResolution;

  float h = 0.0;
  vec2 g = vec2(0.0);
  float domH = 0.0;
  vec2 domC = vec2(0.0);
  float domR = 0.0;

  fallingLayer(px, t, uCellPx * 0.70, 0.50, 11.0, 3.0, 0.09, 0.24, 0.82, 0.42, 1.10, h, g, domH, domC, domR);
  fallingLayer(px, t, uCellPx * 0.40, 0.80, 27.0, 2.8, 0.08, 0.21, 0.88, 0.26, 0.80, h, g, domH, domC, domR);
  fallingLayer(px, t, uCellPx * 0.17, 1.30, 43.0, 2.4, 0.07, 0.18, 0.92, 0.14, 0.50, h, g, domH, domC, domR);
  float mist;
  condensation(px, 61.0, uCellPx * 0.075, 0.34, h, g, mist);

  // Ease the normal in over the flat, un-beaded areas so per-cell seams do not
  // show. The threshold is deliberately low: at 0.02 this was also suppressing
  // the micro-condensation, whose gradients are an order of magnitude smaller
  // than a bead's, and the dense fine mist the reference is full of vanished.
  float slope = smoothstep(0.004, 0.12, length(g));
  g *= mix(0.30, 1.0, slope);

  vec3 N = normalize(vec3(-g * 0.85, 1.0));

  // ---- refraction -------------------------------------------------------
  // Two terms, and the second is what sells it.
  //  1. slope-based bend, which is the obvious part;
  //  2. a ball-lens term that flips the sample point about the bead's own
  //     centre, so a drop shows a small upside-down piece of the room. Real
  //     drops are lenses; without this they read as glass beads.
  vec2 uvR = uv - g * (0.045 * uIntensity);

  float lensAmt = smoothstep(0.0, 0.45, domH);
  if (lensAmt > 0.001) {
    // domC is in pixels, so this is a straight flip about the bead centre
    vec2 rel = px - domC;
    vec2 lensScreen = (domC - rel * 0.42) / max(uResolution, vec2(1.0));
    uvR = mix(uvR, lensScreen, lensAmt * 0.85);
  }
  uvR = clamp(uvR, vec2(-0.25), vec2(1.25));

  vec3 col = interior(uvR);

  // ---- lighting ---------------------------------------------------------
  vec3 L = normalize(vec3(-0.28, -0.82, 0.50));   // above-left, as in the photo
  float ndl = max(dot(N, L), 0.0);

  // ONE tight specular on the crown of each bead. This is the detail that
  // reads as photographic; a broad rim would read as a soap bubble.
  float spec = pow(ndl, 52.0) * 2.8;

  // Light entering the drop focuses on the inside of its lower wall: a small
  // bright crescent opposite the highlight. Tiny, but it is the detail that
  // makes the drop look like it contains liquid rather than glass.
  vec3 Lc = normalize(vec3(0.22, 0.76, 0.62));
  float caustic = pow(max(dot(N, Lc), 0.0), 26.0) * 0.62 * lensAmt;

  // rim sheen, kept low for the same reason the rim is asymmetric
  float fres = pow(1.0 - clamp(N.z, 0.0, 1.0), 3.2);

  float wet = clamp(length(g) * 1.5, 0.0, 1.0);
  // Steepest part of a bead = closest to its edge, where the drop bends light
  // through the dark room rather than the lit one. Without this the drops sit
  // on the glass instead of sitting *in* it.
  float edge = smoothstep(0.25, 1.1, length(g));

  // the underside of a bead sits in its own shadow
  col = mix(col, uDeep * 0.35, clamp(-g.y * 1.5, 0.0, 0.68));
  col = mix(col, uDeep * 0.30, edge * 0.30);
  col += uSpecular * (spec + caustic) * uIntensity;
  col += uHaze * fres * 0.22 * uIntensity;
  col += uHaze * wet * 0.045;

  // The fine mist scatters light rather than specularly reflecting it, so it is
  // shaded as a haze that lifts and cools whatever is behind it. This is the
  // grain that makes the pane read as wet rather than merely spotty.
  float mistAmt = clamp(mist * 2.6, 0.0, 0.34);
  col = mix(col, mix(uHaze * 0.42, uMid, 0.35), mistAmt);
  // and a matching touch of grain in the highlights so it is not flat
  col += uHaze * mistAmt * 0.22;

  // condensation cools the whole pane slightly
  col = mix(col, uMid, 0.10 * (1.0 - wet));

  // filmic shoulder so highlights roll off instead of clipping
  col = col / (col + vec3(0.72)) * 1.42;
  col *= 1.0 - smoothstep(0.45, 1.25, length(centred)) * 0.42;

  float a = clamp(0.34 + wet * 0.62 + spec * 0.9, 0.0, 1.0);
  gl_FragColor = vec4(col, mix(0.55, a, uIntensity));
}
`;