"use client";

import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { LogoMark } from "./Logo";
import { LangSwitch } from "./Nav";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative overflow-hidden bg-ink px-5 pb-28 pt-16 md:px-12 md:pb-10 md:pt-24">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-5" dir="ltr">
          <LogoMark className="h-16 w-16 md:h-24 md:w-24" />
          <p lang="en" className="font-sans text-[12vw] font-extralight uppercase leading-none tracking-[0.12em] md:text-[6vw]">
            <span className="text-gold">Celina</span> Bites
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.35em] text-dough/70">
            {[
              [t("navMenu"), "#menu"],
              [t("sigTitle"), "#favourites"],
              [t("navOven"), "#oven"],
              [t("navVisit"), "#visit"],
              ["Instagram", site.instagram],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} className="inline-flex min-h-11 items-center hover:text-gold">
                  {l}
                </a>
              </li>
            ))}
            <li>
              <LangSwitch className="px-0" />
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-dashed border-dough/15 pt-6 text-[11px] uppercase tracking-[0.35em] text-dough/45">
        <span>
          © {new Date().getFullYear()} {site.name} · {t("footRights")}
        </span>
        <span className="font-serif text-base text-dough/30">{site.nameAr}</span>
      </div>
    </footer>
  );
}
