/**
 * Botanical artwork.
 *
 * Purpose-built SVG marks rather than stock photography. Two reasons:
 *  - every visual is genuinely licensed for this use, with no attribution or
 *    third-party request at runtime;
 *  - nothing depicts a product, an ingredient or a result, so the site cannot
 *    imply a claim the company has not verified.
 *
 * They are decorative. Every component that renders one sets aria-hidden and
 * is purely visual â€” the content around it carries all the meaning.
 */

interface BotanicalProps {
  className?: string;
  style?: React.CSSProperties;
  /** Rotation in degrees, to avoid obvious repeats between sections. */
  rotate?: number;
}

/**
 * A sprig of leaves â€” the core motif. Drawn as stroked stems with paired
 * leaf blades, so it reads as drawn rather than as clip-art.
 */
export function LeafSprig({ className, style, rotate = 0 }: BotanicalProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ ...style, transform: rotate ? `rotate(${rotate}deg)` : style?.transform }}
    >
      <path
        d="M60 196C60 140 60 92 60 44"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {[
        { y: 150, s: 1, dir: 1 },
        { y: 122, s: 0.88, dir: -1 },
        { y: 96, s: 0.76, dir: 1 },
        { y: 72, s: 0.62, dir: -1 },
      ].map((l) => (
        <g key={l.y} transform={`translate(60 ${l.y}) scale(${l.dir * l.s} ${l.s})`}>
          <path
            d="M0 0C18 -6 32 -18 40 -36C22 -34 6 -22 0 0Z"
            fill="currentColor"
            opacity="0.28"
          />
          <path
            d="M0 0C18 -6 32 -18 40 -36"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.45"
          />
        </g>
      ))}
      <path
        d="M60 44C50 32 46 20 50 8C62 14 66 28 60 44Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

/**
 * A wide band of overlapping leaf silhouettes. Used as a low-contrast
 * texture behind deep-green sections, where a photograph would fight the
 * type.
 */
export function LeafField({ className, style }: BotanicalProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g opacity="0.5">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 97) % 1200;
          const y = 60 + ((i * 53) % 300);
          const r = (i * 37) % 360;
          const s = 0.55 + (((i * 17) % 60) / 100);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
              <path
                d="M0 0C40 -14 70 -40 86 -80C40 -74 10 -44 0 0Z"
                fill="currentColor"
                opacity={0.05 + ((i % 4) * 0.035)}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/**
 * A single large leaf, used as an art-directed focal element. The vein
 * structure is drawn explicitly because it is what makes a leaf read as
 * botanical at large scale.
 */
export function HeroLeaf({ className, style, rotate = 0 }: BotanicalProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ ...style, transform: rotate ? `rotate(${rotate}deg)` : style?.transform }}
    >
      <defs>
        <linearGradient id="heroLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path
        d="M150 396C150 300 150 190 150 96C150 60 168 30 196 12C214 46 226 88 224 132C220 232 188 330 150 396Z"
        fill="url(#heroLeafGrad)"
      />
      <path
        d="M150 396C150 300 150 190 150 96C150 60 168 30 196 12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {[
        { y: 130, len: 46, dir: 1 },
        { y: 176, len: 54, dir: -1 },
        { y: 222, len: 50, dir: 1 },
        { y: 268, len: 42, dir: -1 },
        { y: 312, len: 33, dir: 1 },
      ].map((v) => (
        <g key={v.y}>
          <path
            d={`M150 ${v.y}C${150 + v.len * 0.4 * v.dir} ${v.y - 12} ${150 + v.len * 0.8 * v.dir} ${v.y - 26} ${150 + v.len * v.dir} ${v.y - 34}`}
            stroke="currentColor"
            strokeWidth="1.3"
            opacity="0.42"
            strokeLinecap="round"
          />
          <path
            d={`M150 ${v.y}C${150 - v.len * 0.4 * v.dir} ${v.y - 12} ${150 - v.len * 0.8 * v.dir} ${v.y - 26} ${150 - v.len * v.dir} ${v.y - 34}`}
            stroke="currentColor"
            strokeWidth="1.3"
            opacity="0.42"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Concentric organic rings â€” a "growth" motif used on the contact route to
 * give it a focal point the other pages do not share.
 */
export function GrowthRings({ className, style }: BotanicalProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[1, 0.82, 0.66, 0.52, 0.4, 0.3, 0.21, 0.14].map((s, i) => (
        <ellipse
          key={i}
          cx="200"
          cy="200"
          rx={180 * s}
          ry={180 * s}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={0.5 - i * 0.045}
        />
      ))}
      <path
        d="M200 20C200 120 200 280 200 380"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.3"
      />
      <path
        d="M20 200C120 200 280 200 380 200"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.3"
      />
    </svg>
  );
}

/**
 * A plate / bowl outline used as a quiet structural mark on the care route.
 * Abstract on purpose: it is a plate, not any specific dish.
 */
export function PlateMark({ className, style }: BotanicalProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <circle cx="60" cy="60" r="9" fill="currentColor" opacity="0.3" />
      {[
        { a: 0, x: 60, y: 30 },
        { a: 60, x: 84.7, y: 45 },
        { a: 120, x: 84.7, y: 75 },
        { a: 180, x: 60, y: 90 },
        { a: 240, x: 35.3, y: 75 },
        { a: 300, x: 35.3, y: 45 },
      ].map((d) => (
        <circle key={d.a} cx={d.x} cy={d.y} r="5.5" fill="currentColor" opacity="0.26" />
      ))}
    </svg>
  );
}
