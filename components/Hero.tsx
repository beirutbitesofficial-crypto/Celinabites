"use client";

import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { Bake } from "./Bakes";
import { LogoMark } from "./Logo";
import OpenStatus from "./OpenStatus";
import { SplitChars } from "./SplitText";

// Embers drifting up out of the oven: [left %, delay s, duration s, size px]
const EMBERS = [
  [8, 0, 7, 3], [17, 2.4, 9, 2], [26, 4.1, 8, 4], [38, 1.2, 10, 2], [47, 5.5, 7.5, 3], [58, 0.6, 9.5, 2],
  [66, 3.3, 8, 3], [74, 6.2, 11, 2], [83, 1.8, 7, 4], [92, 4.8, 9, 2], [33, 7.4, 8.5, 3], [70, 8.1, 9, 2],
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { t, lang } = useLang();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ, (context) => {
        const { desktop, reduced } = context.conditions as Record<keyof typeof MQ, boolean>;
        if (reduced) {
          gsap.set(q(".hero-reveal"), { autoAlpha: 1 });
          return;
        }

        // ---- Intro on load: the dough rises, zaatar lands, then someone takes a bite ----
        const intro = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
        intro
          .set(q(".hero-reveal"), { autoAlpha: 1 })
          .fromTo(q(".hero-bg"), { scale: 1.25, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.8 }, 0)
          .fromTo(q(".hero-mark .logo-dough"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 1.4, ease: "back.out(1.5)" }, 0.3)
          .fromTo(q(".hero-mark .logo-rim"), { scale: 0.3, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 1.1 }, 0.55)
          .fromTo(q(".hero-mark .logo-speck"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" }, { scale: 1, duration: 0.6, stagger: 0.04, ease: "back.out(3)" }, 0.75)
          .fromTo(q(".hero-mark .logo-bite"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" }, { scale: 1, duration: 0.5, stagger: 0.12, ease: "power4.out" }, 1.45)
          .fromTo(q(".hero-title .char"), { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.045 }, 0.9)
          .fromTo(q(".hero-script"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "power2.inOut" }, 1.5)
          .fromTo(q(".hero-loc"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 1.7)
          .fromTo(q(".hero-cta"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.08 }, 1.9)
          .fromTo(q(".hero-corner"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" }, 2.0);

        // The big manousheh behind keeps turning, slowly.
        gsap.to(q(".hero-spin"), { rotate: 360, duration: 120, ease: "none", repeat: -1 });

        // ---- Scroll out: copy lifts away, backdrop drifts slower ----
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
          .to(q(".hero-content"), { yPercent: -25, autoAlpha: 0 }, 0)
          .to(q(".hero-bg-inner"), { yPercent: 16, scale: 1.08 }, 0)
          .to(q(".hero-chrome"), { autoAlpha: 0, duration: 0.3 }, 0);

        if (desktop) {
          const layers = [
            { el: q(".hero-bg-inner")[0], depth: 18 },
            { el: q(".hero-mark")[0], depth: -12 },
          ].map(({ el, depth }) => ({
            depth,
            x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
          }));
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => (l.x(nx * l.depth), l.y(ny * l.depth)));
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => window.removeEventListener("pointermove", onMove);
        }
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative h-screen-s min-h-[580px] w-full overflow-hidden bg-ink" aria-label="Celina Bites">
      {/* Backdrop: a giant manousheh in the dark, lit from below like the oven mouth */}
      <div className="hero-bg hero-reveal invisible-pre absolute inset-0">
        <div className="hero-bg-inner absolute -inset-[6%] grid place-items-center opacity-30 will-change-transform">
          <div className="hero-spin w-[140vmin] md:w-[105vmin]">
            <Bake kind="zaatar" uid="hero" className="h-auto w-full" />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(232,87,42,0.28), transparent 70%), radial-gradient(ellipse 45% 40% at 50% 42%, rgba(212,168,67,0.18), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 vignette" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden" aria-hidden="true">
        {EMBERS.map(([l, d, dur, s], i) => (
          <span
            key={i}
            className="ember absolute bottom-0 rounded-full bg-ember"
            style={{ left: `${l}%`, width: s, height: s, animationDelay: `${d}s`, animationDuration: `${dur}s`, boxShadow: "0 0 8px 2px rgba(232,87,42,.6)" }}
          />
        ))}
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-5 pt-10 text-center">
        <h1 className="sr-only">Celina Bites — سيلينا بايتس — {t("heroLine")}</h1>
        <LogoMark className="hero-mark hero-reveal invisible-pre w-[min(30vw,17svh)] drop-shadow-[0_20px_60px_rgba(212,168,67,0.35)] md:w-[min(13vw,19vh)]" />

        <div className="relative mt-7 md:mt-9" aria-hidden="true" dir="ltr">
          <p lang="en" className="hero-title hero-reveal invisible-pre whitespace-nowrap font-sans text-[10.5vw] font-extralight uppercase leading-none tracking-[0.1em] md:text-[7.2vw] md:tracking-[0.14em]">
            <SplitChars text="Celina" className="text-gold" />
            <span className="inline-block w-[0.35em]" />
            <SplitChars text="Bites" />
          </p>
          <p
            lang={lang}
            className={`hero-script hero-reveal invisible-pre pointer-events-none absolute right-[-2%] rotate-[-6deg] whitespace-nowrap font-script leading-none text-gold/90 ${
              lang === "ar" ? "-bottom-[1.15em] text-[8.5vw] md:text-[3.6vw]" : "-bottom-[0.95em] text-[10vw] md:text-[4.6vw]"
            }`}
          >
            {t("heroScript")}
          </p>
        </div>

        <p className="hero-loc hero-reveal invisible-pre mt-16 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-dough/75 md:mt-20 md:text-sm">
          <span className="h-px w-8 bg-gold/70 md:w-12" />
          {t("heroLine")}
          <span className="h-px w-8 bg-gold/70 md:w-12" />
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#menu" className="hero-cta hero-reveal invisible-pre inline-flex min-h-12 items-center gap-3 rounded-full bg-gold px-7 text-xs font-bold uppercase tracking-[0.28em] text-ink transition-transform hover:-translate-y-0.5">
            {t("heroOrder")}
            <svg className="h-3 w-5 rtl:-scale-x-100" viewBox="0 0 24 12" fill="none" aria-hidden="true">
              <path d="M0 6 H22 M17 1 L22 6 L17 11" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </a>
          <a href="#oven" className="hero-cta hero-reveal invisible-pre inline-flex min-h-12 items-center rounded-full border border-dough/25 px-7 text-xs font-semibold uppercase tracking-[0.28em] text-dough/85 transition-colors hover:border-dough/60">
            {t("heroWatch")}
          </a>
        </div>
        <OpenStatus className="hero-cta hero-reveal invisible-pre mt-6 text-xs text-dough/60" />
      </div>

      <div className="hero-chrome pointer-events-none absolute inset-0 z-10">
        <div className="hero-corner hero-reveal invisible-pre absolute left-5 top-1/2 hidden -translate-y-1/2 font-serif text-2xl leading-[1.6] text-dough/30 [writing-mode:vertical-rl] md:left-10 md:block">
          سيلينا بايتس
        </div>
        <div lang="en" className="hero-corner hero-reveal invisible-pre absolute right-5 top-1/2 hidden -translate-y-1/2 text-[11px] uppercase tracking-[0.5em] text-dough/40 [writing-mode:vertical-rl] md:right-10 md:block">
          Manakish · Bakery · Pizza
        </div>
        <div className="hero-corner hero-reveal invisible-pre absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-8">
          <span className="text-[11px] uppercase tracking-[0.5em] text-dough/55">{t("scroll")}</span>
          <span className="relative block h-10 w-px overflow-hidden bg-dough/15">
            <span className="scroll-tick absolute inset-x-0 top-0 h-1/2 bg-gold" />
          </span>
        </div>
      </div>
    </section>
  );
}
