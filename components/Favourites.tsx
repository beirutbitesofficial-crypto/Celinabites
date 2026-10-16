"use client";

import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { basePrice, categoryOf, findItem, money, showcase } from "@/lib/menu";
import AddButton from "./AddButton";
import { Bake, bakeFor } from "./Bakes";

export default function Favourites() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { t, tx, lang } = useLang();
  const items = showcase.map((id) => findItem(id)!).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      // In Arabic the row runs right → left, so the track slides the other way.
      const dir = document.documentElement.dir === "rtl" ? 1 : -1;

      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const horizontal = gsap.to(el, {
          x: () => dir * distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
        });
        gsap.fromTo(q(".fv-progress"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        q(".fv-card").forEach((card) => {
          const img = card.querySelector(".fv-img");
          const [start, end] = dir === 1 ? ["right left", "left right"] : ["left right", "right left"];
          gsap.fromTo(img, { rotate: -14, scale: 1.04 }, { rotate: 14, scale: 1.04, ease: "none", scrollTrigger: { trigger: card, containerAnimation: horizontal, start, end, scrub: true } });
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(q(".fv-title .word"), { yPercent: 115 }, { yPercent: 0, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 30%", scrub: 0.8 } });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="favourites" className="relative overflow-hidden bg-ink-2 py-24 hz:h-screen-s hz:py-0">
      <div className="flex h-full flex-col hz:justify-center">
        <div className="flex items-end justify-between gap-6 px-5 md:px-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gold">{t("sigKicker")}</p>
            <h2 className="fv-title mt-4 font-serif text-[13vw] leading-[1.1] md:text-[6vw]">
              <span className="inline-block overflow-hidden pb-[0.1em]">
                <span className="word inline-block">{t("sigTitle")}</span>
              </span>
            </h2>
          </div>
          <span className="relative mb-3 hidden h-px w-56 overflow-hidden bg-dough/15 hz:block">
            <span className="fv-progress absolute inset-0 origin-left bg-gold rtl:origin-right" />
          </span>
        </div>

        <div
          ref={track}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-12 hz:mt-12 hz:w-max hz:snap-none hz:overflow-visible hz:gap-8 hz:pe-[20vw]"
        >
          {items.map((item, i) => {
            const cat = categoryOf(item.id)!;
            return (
              <article key={item.id} className="fv-card group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] bg-ink sm:w-[48vw] hz:w-[30vw] hz:max-w-[460px]">
                <div className="bake-stage relative grid aspect-[4/5] place-items-center overflow-hidden hz:aspect-auto hz:h-[52vh]">
                  <div className="fv-img w-[72%] transition-transform duration-700 group-hover:scale-[1.06] hz:w-[min(72%,40vh)]">
                    <Bake kind={bakeFor(item.id, cat.art)} uid={`fv-${item.id}`} className="h-auto w-full" />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink to-transparent" />
                  <span className="absolute start-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-dough/80 backdrop-blur" lang="en">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute end-5 top-5 font-script text-2xl text-gold/80">{tx(cat.title)}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-3xl">{tx(item.name)}</h3>
                    <p dir="ltr" className="shrink-0 whitespace-nowrap font-serif text-xl text-gold">
                      {money(basePrice(item), lang)}
                    </p>
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-dough/60">{item.desc ? tx(item.desc) : tx(cat.note ?? cat.script)}</p>
                  <div className="mt-auto pt-2">
                    <AddButton item={item} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
