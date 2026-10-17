"use client";

import { useId } from "react";

/** The Celina Pastry mark: a golden manousheh, fingertip dimples, zaatar — with one bite taken out. */
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 100 100" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <mask id={`${uid}-bite`} maskUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="#fff" />
          <circle className="logo-bite" cx="86" cy="18" r="17" fill="#000" />
          <circle className="logo-bite" cx="94" cy="36" r="11" fill="#000" />
        </mask>
        <radialGradient id={`${uid}-crust`} cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#F2CF7A" />
          <stop offset="0.7" stopColor="#D4A843" />
          <stop offset="1" stopColor="#B0832A" />
        </radialGradient>
      </defs>
      <g mask={`url(#${uid}-bite)`}>
        <circle className="logo-dough" cx="50" cy="52" r="44" fill={`url(#${uid}-crust)`} />
        <circle className="logo-rim" cx="50" cy="52" r="36" fill="none" stroke="#B0832A" strokeOpacity=".55" strokeWidth="2" />
        <g className="logo-zaatar" fill="#5F6E2C">
          {[
            [36, 40], [50, 34], [62, 44], [42, 56], [56, 60], [34, 66], [66, 66], [50, 74], [28, 52], [70, 54], [46, 46], [58, 52],
          ].map(([x, y], i) => (
            <circle key={i} className="logo-speck" cx={x} cy={y} r={i % 3 ? 2.6 : 3.4} />
          ))}
        </g>
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span lang="en" dir="ltr" className={`font-sans font-light uppercase tracking-[0.2em] ${className}`}>
      <span className="text-gold">Celina</span> <span className="text-dough">Pastry</span>
    </span>
  );
}

export default function Logo({ className = "", markClass = "h-9 w-9" }: { className?: string; markClass?: string }) {
  return (
    <span dir="ltr" className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className={markClass} />
      <Wordmark className="text-sm" />
    </span>
  );
}
