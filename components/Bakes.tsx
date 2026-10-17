/**
 * Hand-drawn SVG bakes — the site has no product photos yet, so every dish is illustrated
 * in one style: warm crust gradients, top light, zaatar/sesame specks. All in a 200×200 box.
 * To use real photos later, swap <Bake> for an <img> in Menu / Favourites.
 */

export type BakeKind = "zaatar" | "cheese" | "croissant" | "lotus" | "sawari" | "pastry" | "kaak" | "pizza" | "fatayer";

// Deterministic scatter (same on server and client).
function scatter(seed: number, n: number, cx: number, cy: number, r: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * r;
    return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, rot: rnd() * 180, k: rnd() };
  });
}

function Crust({ id, light = "#F3D58C", mid = "#D9A84E", dark = "#A86F27" }: { id: string; light?: string; mid?: string; dark?: string }) {
  return (
    <radialGradient id={id} cx="42%" cy="36%" r="70%">
      <stop offset="0" stopColor={light} />
      <stop offset="0.65" stopColor={mid} />
      <stop offset="1" stopColor={dark} />
    </radialGradient>
  );
}

function Manousheh({ uid, cheese }: { uid: string; cheese?: boolean }) {
  const specks = scatter(cheese ? 7 : 3, cheese ? 0 : 150, 100, 100, 64);
  const bubbles = scatter(11, 14, 100, 100, 62);
  return (
    <>
      <defs>
        <Crust id={`${uid}c`} />
        <radialGradient id={`${uid}z`} cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#8C9A48" />
          <stop offset="1" stopColor="#56622A" />
        </radialGradient>
        <radialGradient id={`${uid}k`} cx="45%" cy="38%" r="70%">
          <stop offset="0" stopColor="#FFF4D2" />
          <stop offset="0.6" stopColor="#F4D98F" />
          <stop offset="1" stopColor="#D9A447" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="176" rx="74" ry="9" fill="#000" opacity=".35" />
      <circle cx="100" cy="100" r="84" fill={`url(#${uid}c)`} />
      <circle cx="100" cy="100" r="70" fill={cheese ? `url(#${uid}k)` : `url(#${uid}z)`} />
      {cheese ? (
        <>
          {bubbles.map((b, i) => (
            <ellipse key={i} cx={b.x} cy={b.y} rx={4 + b.k * 7} ry={3 + b.k * 5} fill="#C98B2E" opacity={0.25 + b.k * 0.35} />
          ))}
          <path d="M60 80 q20 -14 40 -4 t42 4" fill="none" stroke="#FFF9E6" strokeWidth="5" strokeLinecap="round" opacity=".5" />
        </>
      ) : (
        <>
          {specks.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={0.9 + p.k * 1.4} fill={p.k > 0.82 ? "#E9D9A6" : p.k > 0.5 ? "#3E4A1C" : "#9EAC5A"} />
          ))}
          <path d="M58 76 q24 -16 52 -6" fill="none" stroke="#E8F0B0" strokeWidth="4" strokeLinecap="round" opacity=".25" />
        </>
      )}
      {/* fingertip dimples on the rim */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <ellipse key={i} cx={100 + Math.cos(a) * 77} cy={100 + Math.sin(a) * 77} rx="4.5" ry="2.6" transform={`rotate(${(a * 180) / Math.PI + 90} ${100 + Math.cos(a) * 77} ${100 + Math.sin(a) * 77})`} fill="#9B6421" opacity=".35" />;
      })}
    </>
  );
}

const CROISSANT =
  "M28 128 C18 104 40 82 58 92 C62 64 84 52 100 54 C116 52 138 64 142 92 C160 82 182 104 172 128 C160 140 140 134 132 122 C122 136 78 136 68 122 C60 134 40 140 28 128 Z";

function Croissant({ uid, lotus }: { uid: string; lotus?: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C46C" />
          <stop offset="0.55" stopColor="#D58F33" />
          <stop offset="1" stopColor="#9C5A1C" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="150" rx="76" ry="9" fill="#000" opacity=".35" />
      <path d={CROISSANT} fill={`url(#${uid}c)`} />
      {/* layered ridges */}
      {[72, 88, 100, 112, 128].map((x, i) => (
        <path key={x} d={`M${x} ${i === 2 ? 56 : 66} Q${x + (x < 100 ? -8 : x > 100 ? 8 : 0)} 96 ${x} 128`} fill="none" stroke="#8A4C14" strokeWidth="2.4" opacity=".45" />
      ))}
      <path d="M64 84 Q100 62 136 84" fill="none" stroke="#FFE3A3" strokeWidth="5" strokeLinecap="round" opacity=".45" />
      {lotus && (
        <>
          <path d="M44 104 q14 -12 28 0 t28 0 t28 0 t28 0" fill="none" stroke="#7A3F12" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 116 q12 -10 25 0 t25 0 t25 0 t25 0" fill="none" stroke="#F6E4C4" strokeWidth="3.5" strokeLinecap="round" />
          {scatter(5, 18, 100, 92, 30).map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width="5" height="3" rx="1" transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill="#B5722E" />
          ))}
        </>
      )}
    </>
  );
}

function Sawari({ uid }: { uid: string }) {
  // A tray of mini croissants, every other one drizzled.
  const minis = [
    { x: 58, y: 74, r: -14 },
    { x: 142, y: 74, r: 12 },
    { x: 34, y: 116, r: -6 },
    { x: 100, y: 112, r: 4 },
    { x: 166, y: 116, r: 8 },
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C46C" />
          <stop offset="0.55" stopColor="#D58F33" />
          <stop offset="1" stopColor="#9C5A1C" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="170" rx="88" ry="10" fill="#000" opacity=".35" />
      <path d="M12 140 H188 L176 162 H24 Z" fill="#2A1E16" />
      <path d="M12 140 H188" stroke="#D4A843" strokeWidth="3" opacity=".7" />
      {minis.map((m, i) => (
        <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.r}) scale(0.42) translate(-100 -96)`}>
          <path d={CROISSANT} fill={`url(#${uid}c)`} />
          <path d="M64 84 Q100 62 136 84" fill="none" stroke="#FFE3A3" strokeWidth="6" strokeLinecap="round" opacity=".4" />
          {[84, 116].map((x) => (
            <path key={x} d={`M${x} 64 Q${x} 96 ${x} 126`} fill="none" stroke="#8A4C14" strokeWidth="3" opacity=".4" />
          ))}
          {i % 2 === 0 && <path d="M44 104 q14 -12 28 0 t28 0 t28 0 t28 0" fill="none" stroke="#5B2E0E" strokeWidth="7" strokeLinecap="round" />}
        </g>
      ))}
    </>
  );
}

function Pastry({ uid }: { uid: string }) {
  // Ash el bulbul: a spiral nest of shredded pastry with a pistachio heart.
  const ring = Array.from({ length: 140 }, (_, i) => {
    const a = i * 0.32;
    const r = 18 + i * 0.42;
    return { x: 100 + Math.cos(a) * r, y: 100 + Math.sin(a) * r * 0.92, a };
  });
  return (
    <>
      <defs>
        <Crust id={`${uid}c`} light="#F5D58A" mid="#DDA046" dark="#A2621F" />
      </defs>
      <ellipse cx="100" cy="172" rx="70" ry="9" fill="#000" opacity=".35" />
      <circle cx="100" cy="100" r="78" fill={`url(#${uid}c)`} />
      {ring.map((p, i) => (
        <path
          key={i}
          d={`M${p.x} ${p.y} q${Math.cos(p.a + 1.6) * 9} ${Math.sin(p.a + 1.6) * 9} ${Math.cos(p.a + 1.6) * 16} ${Math.sin(p.a + 1.6) * 14}`}
          fill="none"
          stroke={i % 3 ? "#9A5B1C" : "#FFE3A0"}
          strokeWidth="1.6"
          opacity={i % 3 ? 0.45 : 0.6}
        />
      ))}
      <circle cx="100" cy="100" r="22" fill="#6E8B33" />
      {scatter(9, 26, 100, 100, 18).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2 + p.k * 2} fill={p.k > 0.5 ? "#9DBA4E" : "#4F6A22"} />
      ))}
    </>
  );
}

function Kaak({ uid }: { uid: string }) {
  // The purse-shaped Beirut street kaak, covered in sesame.
  const ring = "M100 26 C150 26 178 70 172 112 C166 156 136 178 100 178 C64 178 34 156 28 112 C22 70 50 26 100 26 Z";
  const hole = "M100 84 C130 84 146 104 144 128 C142 150 124 160 100 160 C76 160 58 150 56 128 C54 104 70 84 100 84 Z";
  return (
    <>
      <defs>
        <Crust id={`${uid}c`} light="#EFC173" mid="#C9822F" dark="#8A4A17" />
      </defs>
      <ellipse cx="100" cy="184" rx="70" ry="8" fill="#000" opacity=".35" />
      <path d={`${ring} ${hole}`} fillRule="evenodd" fill={`url(#${uid}c)`} />
      {/* handle */}
      <path d="M78 30 C78 6 122 6 122 30" fill="none" stroke="#B8752A" strokeWidth="14" strokeLinecap="round" />
      <path d="M82 26 C84 12 116 12 118 26" fill="none" stroke="#F0C47A" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      {scatter(13, 120, 100, 104, 70)
        .filter((p) => {
          const dx = (p.x - 100) / 44;
          const dy = (p.y - 122) / 38;
          return dx * dx + dy * dy > 1.25;
        })
        .map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx="2.4" ry="1.2" transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill="#FBEFD0" opacity=".9" />
        ))}
    </>
  );
}

function Pizza({ uid }: { uid: string }) {
  const toppings = scatter(17, 16, 100, 100, 56);
  const olives = scatter(23, 10, 100, 100, 58);
  return (
    <>
      <defs>
        <Crust id={`${uid}c`} light="#F0C77A" mid="#D29440" dark="#97591C" />
        <radialGradient id={`${uid}k`} cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#FFE7A6" />
          <stop offset="0.7" stopColor="#F2B84B" />
          <stop offset="1" stopColor="#D2702A" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="178" rx="78" ry="9" fill="#000" opacity=".35" />
      <circle cx="100" cy="100" r="84" fill={`url(#${uid}c)`} />
      <circle cx="100" cy="100" r="70" fill="#B8341F" />
      <circle cx="100" cy="100" r="66" fill={`url(#${uid}k)`} />
      {toppings.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={7 + p.k * 3} fill="#A8321F" />
          <circle cx={p.x - 2} cy={p.y - 2} r={2} fill="#E06A45" opacity=".7" />
        </g>
      ))}
      {olives.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.4" fill="none" stroke="#2A2118" strokeWidth="2.6" />
      ))}
      {scatter(29, 12, 100, 100, 60).map((p, i) => (
        <path key={i} d={`M${p.x} ${p.y} q4 -6 8 0`} fill="none" stroke="#5E7A2A" strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* slice lines */}
      {[0, 60, 120].map((r) => (
        <line key={r} x1="100" y1="16" x2="100" y2="184" transform={`rotate(${r} 100 100)`} stroke="#8A4A17" strokeWidth="1.4" opacity=".45" />
      ))}
    </>
  );
}

function Fatayer({ uid }: { uid: string }) {
  const tri = (x: number, y: number, r: number, s: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 -44 C6 -44 46 26 42 32 C38 38 -38 38 -42 32 C-46 26 -6 -44 0 -44 Z" fill={`url(#${uid}c)`} />
      <path d="M0 -40 L0 8 M0 8 L-36 32 M0 8 L36 32" stroke="#9A5B1C" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".55" />
      <circle cx="0" cy="8" r="3" fill="#7E4512" opacity=".5" />
    </g>
  );
  return (
    <>
      <defs>
        <Crust id={`${uid}c`} light="#F5D894" mid="#DCA552" dark="#A66A26" />
      </defs>
      <ellipse cx="100" cy="174" rx="82" ry="9" fill="#000" opacity=".35" />
      {tri(62, 112, -14, 0.95)}
      {tri(140, 112, 12, 0.95)}
      {tri(100, 82, 180, 0.9)}
      {/* a little round cheese pie in front */}
      <ellipse cx="100" cy="146" rx="30" ry="18" fill={`url(#${uid}c)`} />
      <ellipse cx="100" cy="142" rx="18" ry="9" fill="#FFF1C7" />
      {scatter(31, 10, 100, 142, 12).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#D49A3B" />
      ))}
    </>
  );
}

export function Bake({ kind, className = "", uid }: { kind: BakeKind; className?: string; uid: string }) {
  const id = `bk-${uid}`;
  return (
    <svg className={`bake ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      {kind === "zaatar" && <Manousheh uid={id} />}
      {kind === "cheese" && <Manousheh uid={id} cheese />}
      {kind === "croissant" && <Croissant uid={id} />}
      {kind === "lotus" && <Croissant uid={id} lotus />}
      {kind === "sawari" && <Sawari uid={id} />}
      {kind === "pastry" && <Pastry uid={id} />}
      {kind === "kaak" && <Kaak uid={id} />}
      {kind === "pizza" && <Pizza uid={id} />}
      {kind === "fatayer" && <Fatayer uid={id} />}
    </svg>
  );
}

/** Which drawing to use for a menu item (falls back to its category's drawing). */
export function bakeFor(itemId: string, catArt: string): BakeKind {
  if (itemId.includes("lotus")) return "lotus";
  if (itemId.startsWith("sawari")) return "sawari";
  if (catArt === "manousheh") return /cheese|awarma|turkey|bikatchu|taouk|fajita|mexicana|kishk|lahme|cocktail|muhammara/.test(itemId) ? "cheese" : "zaatar";
  if (catArt === "croissant") return "croissant";
  if (catArt === "kaak") return "kaak";
  if (catArt === "pizza") return "pizza";
  if (catArt === "pastry") return "pastry";
  return "fatayer";
}
