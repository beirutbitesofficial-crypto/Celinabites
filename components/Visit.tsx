"use client";

import { useEffect, useState } from "react";
import { beirutNow, dayNames, fmtMin } from "@/lib/hours";
import { useLang } from "@/lib/i18n";
import { site, telHref, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Cart";
import OpenStatus from "./OpenStatus";

function Hours() {
  const { t, lang } = useLang();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(beirutNow().dow), []);

  const same = site.hours.every((h) => JSON.stringify(h) === JSON.stringify(site.hours[0]));
  const range = (h: (typeof site.hours)[number]) => (h ? `${fmtMin(h.open, lang)} — ${fmtMin(h.close, lang)}` : t("closed"));

  if (same) {
    return (
      <p className="flex items-baseline justify-between gap-4 border-b border-dashed border-dough/15 py-3">
        <span className="text-dough/70">{t("everyDay")}</span>
        <span className="font-serif text-xl text-gold">{range(site.hours[0])}</span>
      </p>
    );
  }
  // Week starting Monday.
  return (
    <ul>
      {[1, 2, 3, 4, 5, 6, 0].map((d) => (
        <li key={d} className={`flex items-baseline justify-between gap-4 border-b border-dashed border-dough/10 py-2 ${today === d ? "text-gold" : ""}`}>
          <span className={today === d ? "" : "text-dough/70"}>{dayNames[lang][d]}</span>
          <span className="font-serif">{range(site.hours[d])}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Visit() {
  const { t } = useLang();
  const links = [
    { label: "WhatsApp", href: whatsappLink(t("waHello")) },
    ...site.phones.map((p) => ({ label: `${t("call")} ${p}`, href: telHref(p), ltr: true })),
    { label: "Instagram", href: site.instagram },
    { label: t("catering"), href: `mailto:${site.email}` },
    { label: t("directions"), href: site.directionsUrl },
  ];

  return (
    <section id="visit" className="relative overflow-hidden bg-gold px-5 py-24 text-ink md:px-12 md:py-32">
      <div className="pointer-events-none absolute -bottom-[0.3em] -start-8 font-serif text-[38vw] leading-none text-ink/[0.06] md:text-[22vw]" aria-hidden="true">
        فرن
      </div>
      <div className="relative mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-ink/70">{t("visitKicker")}</p>
          <h2 className="mt-4 font-serif text-[13vw] leading-[1.05] md:text-[6.4vw]">
            {t("visitTitleA")}
            <br />
            <em>{t("visitTitleB")}</em>
          </h2>
          <a href="#menu" className="mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-ink px-8 text-xs font-bold uppercase tracking-[0.28em] text-dough transition-transform hover:-translate-y-0.5">
            <WhatsAppIcon className="h-5 w-5 text-gold" />
            {t("startOrder")}
          </a>

          <div className="mt-14 max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-ink/70">{t("hoursTitle")}</p>
            <div className="mt-3 [&_.text-gold]:text-ink [&_.text-dough\/70]:text-ink/70 [&_.border-dough\/15]:border-ink/20 [&_.border-dough\/10]:border-ink/15">
              <Hours />
            </div>
            <OpenStatus className="mt-4 text-sm font-semibold text-ink/80" />
          </div>
        </div>
        <div className="rounded-[32px] bg-ink p-8 text-dough md:p-10">
          <p className="font-script text-4xl text-gold">{t("findUs")}</p>
          <p className="mt-2 font-serif text-4xl">{site.nameAr}</p>
          <p className="mt-3 text-sm text-dough/55">{t("delivPick")}</p>
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="relative mt-6 block aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-dough/10" aria-label={t("openMaps")}>
            <iframe
              title="Celina Bites — map"
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none absolute inset-0 h-full w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)_brightness(0.95)]"
            />
            <span className="absolute bottom-3 start-3 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">{t("openMaps")}</span>
          </a>
          <ul className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-dough/20 px-5 text-xs font-semibold uppercase tracking-[0.22em] transition-colors hover:border-gold hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-dough/55">
            <a href={`mailto:${site.email}`} className="hover:text-gold" dir="ltr">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
