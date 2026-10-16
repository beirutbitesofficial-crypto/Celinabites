"use client";

import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { itemCount } from "@/lib/menu";
import { Bake } from "./Bakes";
import { SplitWords } from "./SplitText";

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const line = t("storyLine");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add(MQ, (ctx) => {
        const { reduced } = ctx.conditions as Record<keyof typeof MQ, boolean>;
        if (reduced) return;
        gsap.fromTo(
          q(".story-line .word"),
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: q(".story-line")[0], start: "top 80%", end: "bottom 45%", scrub: true } }
        );
        gsap.fromTo(
          q(".stat"),
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: q(".stats")[0], start: "top 85%" } }
        );
        gsap.fromTo(q(".story-art"), { yPercent: 12, rotate: -10 }, { yPercent: -12, rotate: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="story" className="relative overflow-hidden bg-ink px-5 py-28 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.25fr_1fr] md:gap-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gold">{t("storyKicker")}</p>
          <p className="story-line mt-6 font-serif text-[8.4vw] leading-[1.3] md:text-[3.1vw]">
            <span className="sr-only">{line}</span>
            <span aria-hidden="true">
              <SplitWords key={lang} text={line} mask={false} />
            </span>
          </p>
          <div className="stats mt-14 grid grid-cols-3 gap-6 border-t border-dough/10 pt-8">
            {[
              { n: `${itemCount}+`, l: t("statItems") },
              { n: "7/7", l: t("statDays") },
              { n: "16h", l: t("statHours") },
            ].map((s) => (
              <div key={s.n} className="stat">
                <p lang="en" className="font-serif text-4xl text-gold md:text-6xl">
                  {s.n}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-dough/55">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-[3/4] w-full max-w-[460px]">
          <div className="bake-stage absolute inset-0 grid place-items-center overflow-hidden rounded-t-[999px] rounded-b-[28px]">
            <div className="story-art w-[80%]">
              <Bake kind="cheese" uid="story" className="h-auto w-full" />
            </div>
          </div>
          <p className="absolute -bottom-8 -left-4 rotate-[-8deg] font-script text-5xl text-gold md:-left-12 md:text-6xl">{t("storyScript")}</p>
        </div>
      </div>
    </section>
  );
}
