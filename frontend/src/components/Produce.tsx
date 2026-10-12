/**
 * Illustrated produce marks.
 *
 * Why drawn rather than photographed:
 *
 *  - Openverse/Wikimedia were both queried for real produce photography. The
 *    usable results were amateur snapshots, frequently under CC BY-NC or
 *    BY-ND (not safe for a commercial client site), shot with inconsistent
 *    light and angle. Seven mismatched stock photos would have looked worse
 *    than one coherent illustrated system.
 *  - An illustration carries no licence obligation and no risk of being
 *    mistaken for the practice's own produce.
 *  - One consistent set across the route reads as art direction; random
 *    photography reads as decoration.
 *
 * These are decorative and always rendered with aria-hidden. They depict
 * general food categories only. They are NOT a product line, an ingredient
 * list, or a claim that any of these foods treats any condition — the care
 * copy remains the only source of meaning on this page.
 */

export type ProduceKind =
  | 'apple'
  | 'citrus'
  | 'greens'
  | 'berries'
  | 'avocado'
  | 'root'
  | 'grain';

interface ProduceProps {
  kind: ProduceKind;
  className?: string;
  /** Relative size within a composition. */
  scale?: number;
  style?: React.CSSProperties;
}

/* ------------------------------------------------------------------ marks */

function Apple({ c }: { c: string[] }) {
  return (
    <>
      <path
        d="M50 26c0 0-9-8.5-22.5-5.8C17 23.2 13 36 17.6 48.6c3.4 9.6 10.6 16 16.4 15.6 3.8-.3 6.2-2.4 10-2.4 3.9 0 6.2 2.1 10 2.4 5.8.4 13-6 16.4-15.6C75 36 71 23.2 60.5 20.2 47 17.5 50 26 50 26Z"
        fill={c[0]}
      />
      <path
        d="M50 26c0 0-9-8.5-22.5-5.8C17 23.2 13 36 17.6 48.6c3.4 9.6 10.6 16 16.4 15.6 3.8-.3 6.2-2.4 10-2.4"
        fill={c[1]}
        opacity="0.45"
      />
      <path d="M50 26c-.4-7 2.4-12.4 7.6-15.4" stroke={c[2]} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M57 12c7-6 17-5.5 20-5 .5 6-3 14-11.6 17-4 1.4-6.4-.5-7-4-.7-3.4-.7-6.4-1.4-8Z" fill={c[1]} />
      <ellipse cx="36" cy="36" rx="6" ry="9" fill={c[2]} opacity="0.22" transform="rotate(-24 36 36)" />
    </>
  );
}

function Citrus({ c }: { c: string[] }) {
  return (
    <>
      <circle cx="50" cy="54" r="32" fill={c[0]} />
      <circle cx="50" cy="54" r="32" fill={c[1]} opacity="0.35" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path
          key={a}
          d="M50 54 L50 24 A30 30 0 0 1 76 39 Z"
          fill={c[2]}
          opacity="0.16"
          transform={`rotate(${a} 50 54)`}
        />
      ))}
      <circle cx="50" cy="54" r="4" fill={c[2]} opacity="0.3" />
      <path
        d="M50 20c0-9 4-14 12-16-2 8-5 13-12 16Z"
        fill={c[3]}
      />
      <ellipse cx="36" cy="38" rx="7" ry="10" fill={c[2]} opacity="0.3" transform="rotate(-28 36 38)" />
    </>
  );
}

function Greens({ c }: { c: string[] }) {
  return (
    <>
      <path d="M50 88C28 74 18 54 20 34c22 2 34 18 30 54Z" fill={c[1]} />
      <path d="M50 88C72 74 82 54 80 34c-22 2-34 18-30 54Z" fill={c[0]} />
      <path d="M50 88C38 68 38 46 50 22c12 24 12 46 0 66Z" fill={c[2]} />
      <path d="M50 22v66" stroke={c[3]} strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      <path d="M50 44c-6-4-12-7-19-8M50 56c6-4 12-7 19-8M50 68c-6-4-12-7-19-8" stroke={c[3]} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" fill="none" />
    </>
  );
}

function Berries({ c }: { c: string[] }) {
  return (
    <>
      <path d="M26 26c8-9 18-10 24-4 6-6 16-5 24 4-10 3-17 9-24 9s-14-6-24-9Z" fill={c[3]} />
      <path d="M50 26v10" stroke={c[3]} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="32" cy="58" r="15" fill={c[0]} />
      <circle cx="62" cy="52" r="12" fill={c[1]} />
      <circle cx="46" cy="76" r="13" fill={c[0]} opacity="0.88" />
      <circle cx="72" cy="76" r="10" fill={c[1]} opacity="0.85" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="32" cy="58" rx="3" ry="4.4" fill={c[2]} opacity="0.3" transform={`rotate(${a} 32 58)`} />
      ))}
      <circle cx="62" cy="52" r="8" fill={c[2]} opacity="0.26" />
      <ellipse cx="46" cy="76" rx="7" ry="10" fill={c[2]} opacity="0.22" transform="rotate(20 46 76)" />
    </>
  );
}

function Avocado({ c }: { c: string[] }) {
  return (
    <>
      <path
        d="M50 16c-18 0-30 16-30 34 0 22 14 42 30 42s30-20 30-42c0-18-12-34-30-34Z"
        fill={c[0]}
      />
      <path
        d="M50 22c-14 0-24 13-24 28 0 18 11 34 24 34s24-16 24-34c0-15-10-28-24-28Z"
        fill={c[1]}
      />
      <ellipse cx="50" cy="62" rx="13" ry="15" fill={c[0]} />
      <path d="M50 10c-2-6 0-10 4-14" stroke={c[3]} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M54-2c7-5 15-3 18-2-2 6-8 10-16 8-2-.6-3-3-2-6Z" fill={c[2]} />
    </>
  );
}

function Root({ c }: { c: string[] }) {
  return (
    <>
      <path d="M38 34h24l-4 52c-1 6-7 6-8 0Z" fill={c[0]} />
      <path d="M38 34h12l-4 52c-1 6-7 6-8 0Z" fill={c[1]} opacity="0.4" />
      <path d="M42 34c-2-12 4-18 8-22 4 4 10 10 8 22Z" fill={c[2]} />
      <path d="M50 12V2" stroke={c[3]} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M50 12c-6-6-12-7-16-7 2 6 8 10 16 7ZM50 12c6-6 12-7 16-7-2 6-8 10-16 7Z" fill={c[2]} opacity="0.9" />
      {[40, 54, 68].map((y) => (
        <path key={y} d={`M40 ${y}h18`} stroke={c[3]} strokeWidth="1.6" opacity="0.28" strokeLinecap="round" />
      ))}
    </>
  );
}

function Grain({ c }: { c: string[] }) {
  return (
    <>
      <path d="M50 92V34" stroke={c[3]} strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
      {[0, 36, 72, 108, 144, 180, 216, 252].map((a) => (
        <g key={a} transform={`rotate(${a} 50 60)`}>
          <ellipse cx="50" cy="30" rx="7" ry="13" fill={c[0]} />
          <ellipse cx="50" cy="30" rx="3" ry="7" fill={c[2]} opacity="0.3" />
        </g>
      ))}
      <circle cx="50" cy="60" r="8" fill={c[1]} />
    </>
  );
}

const PALETTES: Record<ProduceKind, string[]> = {
  // [body, bodyShade, leaf, deepDetail]
  apple: ['#1f5f2e', '#2c7a3b', '#4a9a52', '#12331f'],
  citrus: ['#e39a16', '#f0c05a', '#7cb342', '#b8790d'],
  greens: ['#2c7a3b', '#4a9a52', '#7cb342', '#12331f'],
  berries: ['#7b1e3a', '#9c2f4e', '#c9748a', '#3f8f47'],
  avocado: ['#3f8f47', '#7cb342', '#4a9a52', '#164226'],
  root: ['#c1440e', '#e07a3c', '#4a9a52', '#8f2a19'],
  grain: ['#c9a227', '#e0c05a', '#7cb342', '#8f6f14'],
};

/* ---------------------------------------------------------------- wrapper */

export function Produce({
  kind,
  className,
  scale = 1,
  style,
  size,
}: ProduceProps & { size?: string }) {
  const c = PALETTES[kind];
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
      width={size ?? 100 * scale}
      height={size ?? 100 * scale}
    >
      {kind === 'apple' && <Apple c={c} />}
      {kind === 'citrus' && <Citrus c={c} />}
      {kind === 'greens' && <Greens c={c} />}
      {kind === 'berries' && <Berries c={c} />}
      {kind === 'avocado' && <Avocado c={c} />}
      {kind === 'root' && <Root c={c} />}
      {kind === 'grain' && <Grain c={c} />}
    </svg>
  );
}

/**
 * A composed produce cluster, occupying the well beside each care area.
 *
 * Marks are sized in PERCENT of the well rather than fixed pixels, so the
 * composition fills its container at any size — fixed px left them floating
 * as small islands in a large box.
 */
export function ProduceCluster({
  kinds,
  className,
}: {
  kinds: ProduceKind[];
  className?: string;
}) {
  // Hand-placed so the pair overlaps slightly and fills the square rather than
  // sitting in two corners.
  const LAYOUT: Record<ProduceKind, { left: number; top: number; size: number }> = {
    apple: { left: 3, top: 30, size: 56 },
    citrus: { left: 43, top: 6, size: 50 },
    greens: { left: 40, top: 36, size: 60 },
    berries: { left: 4, top: 6, size: 52 },
    avocado: { left: 41, top: 14, size: 54 },
    root: { left: 14, top: 34, size: 46 },
    grain: { left: 37, top: 2, size: 50 },
  };

  return (
    <div className={className} aria-hidden="true">
      {kinds.map((k, i) => {
        const p = LAYOUT[k];
        return (
          <Produce
            key={`${k}-${i}`}
            kind={k}
            size={`${p.size}%`}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              top: `${p.top}%`,
              filter: 'drop-shadow(0 8px 14px rgba(8,28,17,0.18))',
            }}
          />
        );
      })}
    </div>
  );
}