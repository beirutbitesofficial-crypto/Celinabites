"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { type Category, type Item, menu, money } from "@/lib/menu";
import AddButton from "./AddButton";
import { Bake, bakeFor } from "./Bakes";

// Lowercase, strip Latin accents and Arabic diacritics / tatweel, unify alef & ya forms.
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ًͯ-ٰٟـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

function Tag({ tag }: { tag?: Item["tag"] }) {
  const { t } = useLang();
  if (!tag) return null;
  return (
    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${tag === "signature" ? "bg-gold text-ink" : "bg-dough/10 text-dough/80"}`}>
      {t(tag === "signature" ? "signature" : "isNew")}
    </span>
  );
}

function Prices({ item }: { item: Item }) {
  const { tx, lang } = useLang();
  if (!item.variants || item.variants.length === 1) {
    const p = item.variants ? item.variants[0].price : (item.price ?? 0);
    return (
      <span dir="ltr" className="shrink-0 whitespace-nowrap font-serif text-lg text-gold">
        {money(p, lang)}
      </span>
    );
  }
  return (
    <span className="flex flex-wrap gap-x-4 gap-y-1">
      {item.variants.map((v) => (
        <span key={v.label.en} className="inline-flex items-baseline gap-1.5 text-[13px]">
          <span className="text-dough/50">{tx(v.label)}</span>
          <span dir="ltr" className="whitespace-nowrap font-serif text-base text-gold">
            {money(v.price, lang)}
          </span>
        </span>
      ))}
    </span>
  );
}

function ListRow({ item }: { item: Item }) {
  const { tx } = useLang();
  const multi = item.variants && item.variants.length > 1;
  return (
    <li className="flex flex-col gap-3 border-b border-dashed border-dough/10 py-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h4 className="font-serif text-xl leading-tight md:text-2xl">{tx(item.name)}</h4>
          {item.tag && <Tag tag={item.tag} />}
          {!multi && (
            <>
              <span className="mb-1 hidden flex-1 border-b border-dotted border-dough/20 sm:block" aria-hidden="true" />
              <span className="ms-auto sm:ms-0">
                <Prices item={item} />
              </span>
            </>
          )}
        </div>
        {item.desc && <p className="mt-1 text-[13px] leading-relaxed text-dough/55">{tx(item.desc)}</p>}
        {multi && (
          <div className="mt-2">
            <Prices item={item} />
          </div>
        )}
      </div>
      <AddButton item={item} className="self-start sm:self-center" />
    </li>
  );
}

function CategoryBlock({ cat, items }: { cat: Category; items: Item[] }) {
  const { tx } = useLang();
  const groups = useMemo(() => {
    const g: { name?: string; items: Item[] }[] = [];
    items.forEach((it) => {
      const last = g[g.length - 1];
      const name = it.group ? tx(it.group) : undefined;
      if (last && last.name === name) last.items.push(it);
      else g.push({ name, items: [it] });
    });
    return g;
  }, [items, tx]);
  const art = bakeFor(cat.items[0].id, cat.art);

  return (
    <section id={`cat-${cat.id}`} data-cat={cat.id} className="scroll-mt-36 pt-16 md:pt-24">
      <header className="mb-8 flex items-end gap-5 md:mb-10">
        <div className="bake-stage grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-gold/40 md:h-20 md:w-20">
          <Bake kind={art} uid={`cat-${cat.id}`} className="h-[82%] w-[82%]" />
        </div>
        <div className="min-w-0">
          <p className="font-script text-3xl leading-none text-gold md:text-4xl">{tx(cat.script)}</p>
          <h3 className="font-serif text-4xl leading-tight md:text-5xl">{tx(cat.title)}</h3>
          {cat.note && <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-dough/45">{tx(cat.note)}</p>}
        </div>
      </header>

      <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {groups.map((g, i) => (
            <div key={i} className={i ? "mt-10" : ""}>
              {g.name && <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">{g.name}</p>}
              <ul>
                {g.items.map((it) => (
                  <ListRow key={it.id} item={it} />
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bake-stage tray sticky top-40 hidden aspect-square place-items-center self-start overflow-hidden rounded-[28px] lg:grid">
          <Bake kind={art} uid={`side-${cat.id}`} className="h-auto w-[78%]" />
        </div>
      </div>
    </section>
  );
}

export default function Menu() {
  const { t, tx } = useLang();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(menu[0].id);
  const bar = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return menu.map((c) => ({ cat: c, items: c.items }));
    return menu
      .map((c) => ({
        cat: c,
        items: c.items.filter((i) =>
          norm([i.name.ar, i.name.en, i.desc?.ar, i.desc?.en, i.group?.ar, i.group?.en, c.title.ar, c.title.en].filter(Boolean).join(" ")).includes(q)
        ),
      }))
      .filter((x) => x.items.length);
  }, [query]);

  // Highlight the category in view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-cat]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.cat!);
        });
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  // Keep the active chip visible in the bar.
  useEffect(() => {
    const chip = bar.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    const b = bar.current;
    if (!chip || !b) return;
    // Works for both directions (scrollLeft is negative in RTL, a delta is not).
    const c = chip.getBoundingClientRect();
    const r = b.getBoundingClientRect();
    b.scrollBy({ left: c.left + c.width / 2 - (r.left + r.width / 2), behavior: "smooth" });
  }, [active]);

  return (
    <section id="menu" className="relative bg-ink px-5 pb-32 pt-28 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gold">{t("menuKicker")}</p>
            <h2 className="mt-4 font-serif text-[16vw] leading-[1.05] md:text-[7vw]">
              {t("menuTitleA")} <em className="text-gold">{t("menuTitleB")}</em>
            </h2>
          </div>
          <label className="relative block w-full md:w-96">
            <span className="sr-only">{t("searchLabel")}</span>
            <svg className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dough/40" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              className="min-h-12 w-full rounded-full border border-dough/15 bg-ink-2 pe-5 ps-11 text-sm text-dough placeholder:text-dough/35 focus:border-gold/60 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Sticky category bar */}
      <div className="sticky top-0 z-30 -mx-5 mt-10 border-b border-dough/10 bg-ink/85 backdrop-blur-md md:-mx-12">
        <div ref={bar} className="no-scrollbar mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-5 py-3 md:px-12">
          {filtered.map(({ cat }) => (
            <a
              key={cat.id}
              data-chip={cat.id}
              href={`#cat-${cat.id}`}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                active === cat.id ? "bg-gold text-ink" : "text-dough/60 hover:text-dough"
              }`}
            >
              {tx(cat.title)}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        {filtered.length === 0 && (
          <p className="py-24 text-center font-serif text-2xl text-dough/60">
            {t("noMatch", { q: query })}{" "}
            <button type="button" className="text-gold underline" onClick={() => setQuery("")}>
              {t("clearSearch")}
            </button>
          </p>
        )}
        {filtered.map(({ cat, items }) => (
          <CategoryBlock key={cat.id} cat={cat} items={items} />
        ))}
      </div>
    </section>
  );
}
