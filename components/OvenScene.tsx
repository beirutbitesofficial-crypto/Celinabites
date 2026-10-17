"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type Key } from "@/lib/i18n";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { LogoMark } from "./Logo";

/*
 * THE OVEN — pinned, scroll-scrubbed (timeline seconds; scrolling back reverses it exactly)
 *  0.0 – 1.0   a dough ball drops onto the floured marble and settles
 *  1.0 – 2.2   it is pressed open by hand → a wide disc, fingertip dimples around the rim
 *  2.2 – 3.4   zaatar spreads from the centre, olive oil drizzles over it
 *  3.4 – 4.6   the oven lowers in, the peel slides under, the manousheh goes into the fire
 *  4.6 – 5.8   fire flares, the crust turns golden
 *  5.8 – 7.0   out of the oven, back to the counter, steaming
 *  7.0 – 8.2   a paper wrap slides up, the Celina Pastry stamp lands on it
 *  8.2 – 9.0   hold
 */

const STEPS: Key[] = ["step1", "step2", "step3", "step4", "step5", "step6"];
const STEP_AT = [0, 1.0, 2.2, 3.4, 4.6, 7.0];

const C = { x: 500, y: 560 };
const R = 250;

// Deterministic zaatar / flour / bubble scatter.
function scatter(seed: number, n: number, r: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * r;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, k: rnd() };
  });
}
const ZAATAR = scatter(41, 260, R * 0.8);
const FLOUR = scatter(7, 70, 470);
// Blisters on the crust ring once it's baked.
const BUBBLES = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.12;
  const d = R * (0.88 + (i % 2) * 0.05);
  return { x: Math.cos(a) * d, y: Math.sin(a) * d, k: (i * 37) % 10 / 10 };
});
const DIMPLES = Array.from({ length: 22 }, (_, i) => (i / 22) * Math.PI * 2);

export default function OvenScene() {
  const root = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  // Portrait phones get a tighter crop of the stage so the scene fills the screen.
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 3/4)");
    const on = () => setPortrait(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ, (ctx) => {
        const { reduced, mobile } = ctx.conditions as Record<keyof typeof MQ, boolean>;

        const setCount = (time: number) => {
          const idx = STEP_AT.reduce((n, at, i) => (time >= at - 0.05 ? i : n), 0);
          const el = q(".ov-count")[0];
          if (el) el.textContent = String(idx + 1).padStart(2, "0");
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          paused: reduced,
          scrollTrigger: reduced
            ? undefined
            : {
                trigger: root.current,
                start: "top top",
                end: mobile ? "+=360%" : "+=480%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: () => setCount(tl.time()),
              },
        });

        // initial states
        gsap.set(q(".ov-dough"), { scale: 0.32, y: -520, transformOrigin: "50% 50%" });
        gsap.set(q(".ov-dimple"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" });
        gsap.set(q(".ov-zaatar"), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(q(".ov-oil"), { strokeDashoffset: 1 });
        gsap.set(q(".ov-baked"), { autoAlpha: 0 });
        gsap.set(q(".ov-bubble"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" });
        gsap.set(q(".ov-oven"), { y: -420, autoAlpha: 0 });
        gsap.set(q(".ov-fire"), { scaleY: 0.4, transformOrigin: "50% 100%", transformBox: "fill-box" });
        gsap.set(q(".ov-peel"), { y: 1500 });
        gsap.set(q(".ov-steam"), { autoAlpha: 0, y: 30 });
        gsap.set(q(".ov-wrap"), { y: 1100 });
        gsap.set(q(".ov-stamp"), { scale: 2.4, rotate: -40, autoAlpha: 0, transformOrigin: "50% 50%", transformBox: "fill-box" });
        gsap.set(q(".ov-cap"), { autoAlpha: 0, y: 24 });
        gsap.set(q(".ov-cap-0"), { autoAlpha: 1, y: 0 });

        // 0 – 1: drop & settle
        tl.to(q(".ov-dough"), { y: 0, duration: 0.7, ease: "bounce.out" }, 0)
          .fromTo(q(".ov-flour"), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.55)
          // 1 – 2.2: pressed open
          .to(q(".ov-dough"), { scale: 1, duration: 1.0, ease: "power2.inOut" }, 1.0)
          .to(q(".ov-ball-shine"), { autoAlpha: 0, duration: 0.4 }, 1.0)
          .to(q(".ov-dimple"), { scale: 1, duration: 0.5, stagger: 0.02, ease: "back.out(3)" }, 1.6)
          // 2.2 – 3.4: zaatar & oil
          .to(q(".ov-zaatar"), { scale: 1, duration: 0.8, ease: "power2.out" }, 2.2)
          .to(q(".ov-oil"), { strokeDashoffset: 0, duration: 0.8, stagger: 0.15, ease: "power1.inOut" }, 2.6)
          // 3.4 – 4.6: into the oven
          .to(q(".ov-oven"), { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 3.4)
          .to(q(".ov-peel"), { y: 0, duration: 0.5, ease: "power2.out" }, 3.6)
          .to(q(".ov-pie, .ov-peel"), { y: -262, scale: 0.34, transformOrigin: "50% 50%", duration: 0.7, ease: "power2.in" }, 4.0)
          .to(q(".ov-flour"), { autoAlpha: 0.3, duration: 0.4 }, 4.0)
          .to(q(".ov-peel"), { y: 1500, scale: 1, duration: 0.5, ease: "power2.in" }, 4.7)
          // 4.6 – 5.8: bake
          .to(q(".ov-fire"), { scaleY: 1.25, duration: 0.5, ease: "power2.out" }, 4.6)
          .to(q(".ov-glow"), { autoAlpha: 1, duration: 0.5 }, 4.6)
          .to(q(".ov-baked"), { autoAlpha: 1, duration: 0.01 }, 4.9)
          .to(q(".ov-bubble"), { scale: 1, duration: 0.3, stagger: 0.03 }, 4.9)
          .to(q(".ov-fire"), { scaleY: 0.7, duration: 0.6 }, 5.2)
          // 5.8 – 7.0: out, steaming
          .to(q(".ov-pie"), { y: 0, scale: 1, duration: 0.8, ease: "power3.out" }, 5.8)
          .to(q(".ov-oven"), { y: -420, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 6.0)
          .to(q(".ov-glow"), { autoAlpha: 0, duration: 0.5 }, 6.0)
          .to(q(".ov-steam"), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 6.4)
          // 7.0 – 8.2: wrap & stamp
          .to(q(".ov-wrap"), { y: 0, duration: 0.7, ease: "power3.out" }, 7.0)
          .to(q(".ov-steam"), { autoAlpha: 0, duration: 0.4 }, 7.2)
          .to(q(".ov-stamp"), { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.45, ease: "back.out(2)" }, 7.6)
          .to({}, { duration: 0.8 }, 8.2);

        // Captions + counter
        STEP_AT.forEach((at, i) => {
          if (i === 0) return;
          tl.to(q(`.ov-cap-${i - 1}`), { autoAlpha: 0, y: -24, duration: 0.2 }, at - 0.1).to(q(`.ov-cap-${i}`), { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.05);
        });
        tl.fromTo(q(".ov-progress"), { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);

        if (reduced) {
          tl.progress(1);
          setCount(tl.duration());
          return;
        }

        // Fire and steam keep moving even when scrolling stops.
        gsap.to(q(".ov-steam path"), { y: -24, autoAlpha: 0, duration: 2.4, stagger: 0.5, repeat: -1, ease: "sine.out" });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="oven" className="relative h-screen-s min-h-[560px] overflow-hidden bg-ink" aria-label={t("ovenTitle")}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 62%, rgba(212,168,67,0.10), transparent 70%)" }} aria-hidden="true" />
      <div className="ov-glow pointer-events-none absolute inset-0 opacity-0" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 20%, rgba(232,87,42,0.35), transparent 70%)" }} aria-hidden="true" />

      {/* Heading */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-6 px-5 pt-20 md:px-12 md:pt-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gold">{t("ovenKicker")}</p>
          <h2 className="mt-3 font-serif text-[10vw] leading-none md:text-[4.4vw]">{t("ovenTitle")}</h2>
        </div>
      </div>

      {/* Stage */}
      <svg className="absolute inset-0 h-full w-full" viewBox={portrait ? "180 40 640 980" : "0 0 1000 1000"} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id="ov-marble" cx="50%" cy="60%" r="60%">
            <stop offset="0" stopColor="#2A211B" />
            <stop offset="1" stopColor="#120D0A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ov-raw" cx="42%" cy="36%" r="70%">
            <stop offset="0" stopColor="#FBF1DD" />
            <stop offset="0.7" stopColor="#EBD9B6" />
            <stop offset="1" stopColor="#CDB487" />
          </radialGradient>
          <radialGradient id="ov-gold" cx="42%" cy="36%" r="70%">
            <stop offset="0" stopColor="#F3D58C" />
            <stop offset="0.65" stopColor="#D9A84E" />
            <stop offset="1" stopColor="#9C6322" />
          </radialGradient>
          <radialGradient id="ov-zg" cx="45%" cy="40%" r="65%">
            <stop offset="0" stopColor="#8C9A48" />
            <stop offset="1" stopColor="#4F5B25" />
          </radialGradient>
          <linearGradient id="ov-wood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7A4A24" />
            <stop offset="0.5" stopColor="#A8693A" />
            <stop offset="1" stopColor="#7A4A24" />
          </linearGradient>
          <linearGradient id="ov-fire" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFD27A" />
            <stop offset="0.45" stopColor="#F07A2A" />
            <stop offset="1" stopColor="#B4281A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ov-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4E6CC" />
            <stop offset="1" stopColor="#DCC7A1" />
          </linearGradient>
          <clipPath id="ov-mouth">
            <path d="M330 330 V250 A170 150 0 0 1 670 250 V330 Z" />
          </clipPath>
        </defs>

        {/* Marble counter + flour */}
        <ellipse cx={C.x} cy={C.y} rx="480" ry="380" fill="url(#ov-marble)" />
        <g className="ov-flour" opacity="0">
          {FLOUR.map((p, i) => (
            <circle key={i} cx={C.x + p.x} cy={C.y + p.y * 0.8} r={1 + p.k * 2.4} fill="#F6EBD8" opacity={0.15 + p.k * 0.35} />
          ))}
        </g>

        {/* The oven: brick dome with a fire inside */}
        <g className="ov-oven">
          <path d="M240 340 V240 A260 230 0 0 1 760 240 V340 Z" fill="#3A2318" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI + (i / 8) * Math.PI;
            const x = 500 + Math.cos(a) * 215;
            const y = 250 + Math.sin(a) * 190;
            return <rect key={i} x={x - 30} y={y - 16} width="60" height="32" rx="6" fill={i % 2 ? "#7B3B22" : "#8E4A2A"} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />;
          })}
          <path d="M330 330 V250 A170 150 0 0 1 670 250 V330 Z" fill="#0A0605" />
          <g clipPath="url(#ov-mouth)">
            <g className="ov-fire">
              <path className="flicker" d="M360 330 C370 270 400 250 410 200 C430 250 450 270 440 330 Z" fill="url(#ov-fire)" />
              <path className="flicker" d="M430 330 C440 250 480 220 500 150 C520 220 560 250 570 330 Z" fill="url(#ov-fire)" style={{ animationDelay: ".3s" }} />
              <path className="flicker" d="M560 330 C560 270 590 250 600 210 C615 250 640 280 640 330 Z" fill="url(#ov-fire)" style={{ animationDelay: ".7s" }} />
            </g>
          </g>
          <rect x="220" y="330" width="560" height="26" rx="8" fill="#5A3020" />
          <rect x="220" y="330" width="560" height="6" rx="3" fill="#D4A843" opacity=".35" />
        </g>

        {/* Peel (behind the pie) */}
        <g className="ov-peel">
          <rect x={C.x - 34} y={C.y + 190} width="68" height="380" rx="20" fill="url(#ov-wood)" />
          <ellipse cx={C.x} cy={C.y} rx="290" ry="270" fill="url(#ov-wood)" opacity=".95" />
        </g>

        {/* The manousheh */}
        <g className="ov-pie">
          <g className="ov-dough">
            <g transform={`translate(${C.x} ${C.y})`}>
              <circle r={R} fill="url(#ov-raw)" />
              <circle className="ov-baked" r={R} fill="url(#ov-gold)" />
              <ellipse className="ov-ball-shine" cx={-R * 0.3} cy={-R * 0.35} rx={R * 0.28} ry={R * 0.18} fill="#fff" opacity=".35" />
              {DIMPLES.map((a, i) => (
                <g key={i} transform={`translate(${Math.cos(a) * R * 0.9} ${Math.sin(a) * R * 0.9}) rotate(${(a * 180) / Math.PI + 90})`}>
                  <ellipse className="ov-dimple" rx="13" ry="7" fill="#8A5A22" opacity=".3" />
                </g>
              ))}
              <g className="ov-zaatar">
                <circle r={R * 0.8} fill="url(#ov-zg)" />
                {ZAATAR.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={1.6 + p.k * 2.6} fill={p.k > 0.85 ? "#E9D9A6" : p.k > 0.5 ? "#36411A" : "#9EAC5A"} />
                ))}
              </g>
              {[
                "M-150 -60 C-90 -120 -10 -40 60 -100 S170 -60 180 -20",
                "M-170 60 C-100 0 -20 90 50 30 S150 60 170 100",
              ].map((d, i) => (
                <path key={i} className="ov-oil" d={d} pathLength={1} strokeDasharray="1" fill="none" stroke="#E8D46A" strokeOpacity=".55" strokeWidth="9" strokeLinecap="round" />
              ))}
              {BUBBLES.map((b, i) => (
                <ellipse key={i} className="ov-bubble" cx={b.x} cy={b.y} rx={6 + b.k * 6} ry={4 + b.k * 4} fill="#8A4E17" opacity={0.35 + b.k * 0.3} />
              ))}
            </g>
          </g>
        </g>

        {/* Steam */}
        <g className="ov-steam" fill="none" stroke="#F6EBD8" strokeOpacity=".35" strokeWidth="8" strokeLinecap="round">
          <path d="M430 270 c-24 -40 24 -60 0 -100" />
          <path d="M500 250 c-24 -40 24 -60 0 -110" />
          <path d="M570 270 c-24 -40 24 -60 0 -100" />
        </g>

        {/* Paper wrap + stamp */}
        <g className="ov-wrap">
          <path d={`M${C.x - 300} ${C.y + 20} Q${C.x} ${C.y - 10} ${C.x + 300} ${C.y + 20} L${C.x + 270} ${C.y + 900} H${C.x - 270} Z`} fill="url(#ov-paper)" />
          <path d={`M${C.x - 300} ${C.y + 20} Q${C.x} ${C.y - 10} ${C.x + 300} ${C.y + 20}`} fill="none" stroke="#C9B08A" strokeWidth="4" />
          <g className="ov-stamp">
            <circle cx={C.x} cy={C.y + 135} r="92" fill="none" stroke="#8E2A1F" strokeWidth="5" strokeDasharray="6 7" opacity=".85" />
            <circle cx={C.x} cy={C.y + 135} r="78" fill="none" stroke="#8E2A1F" strokeWidth="2.5" opacity=".85" />
            <text x={C.x} y={C.y + 125} textAnchor="middle" fontFamily="var(--font-manrope), sans-serif" fontWeight="700" fontSize="30" letterSpacing="6" fill="#8E2A1F">
              CELINA
            </text>
            <text x={C.x} y={C.y + 161} textAnchor="middle" fontFamily="var(--font-manrope), sans-serif" fontWeight="700" fontSize="30" letterSpacing="6" fill="#8E2A1F">
              PASTRY
            </text>
            <text x={C.x} y={C.y + 193} textAnchor="middle" fontFamily="var(--font-reem), sans-serif" fontSize="20" fill="#8E2A1F">
              سيلينا باستري
            </text>
          </g>
        </g>
      </svg>

      {/* Captions, counter, progress */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink via-ink/85 to-transparent px-5 pb-8 pt-16 md:px-12 md:pb-12">
        <div className="relative h-16 md:h-20">
          {STEPS.map((k, i) => (
            <p key={k} lang={lang} className={`ov-cap ov-cap-${i} absolute inset-x-0 bottom-0 font-serif text-3xl leading-tight md:text-5xl ${i ? "opacity-0" : ""}`}>
              {t(k)}
            </p>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-dough/55" dir="ltr">
          <span className="font-serif text-base text-gold">
            <span className="ov-count">01</span> / {String(STEPS.length).padStart(2, "0")}
          </span>
          <span className="relative block h-px flex-1 overflow-hidden bg-dough/15">
            <span className="ov-progress absolute inset-0 origin-left bg-gold" />
          </span>
          <LogoMark className="h-6 w-6" />
        </div>
      </div>
    </section>
  );
}
