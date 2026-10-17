"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import Logo from "./Logo";

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      lang={lang === "ar" ? "en" : "ar"}
      className={`inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold text-dough/75 hover:text-gold ${className}`}
    >
      {t("switchLang")}
    </button>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { count, setOpen } = useCart();
  const { t } = useLang();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "pointer-events-none -translate-y-full opacity-0" : "opacity-100"}`}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
        <a href="#top" aria-label="Celina Pastry">
          <Logo markClass="h-8 w-8" className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
        </a>
        <nav className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.25em]">
          <a href="#menu" className="hidden min-h-10 items-center px-3 text-dough/75 hover:text-dough md:inline-flex">
            {t("navMenu")}
          </a>
          <a href="#oven" className="hidden min-h-10 items-center px-3 text-dough/75 hover:text-dough md:inline-flex">
            {t("navOven")}
          </a>
          <a href="#visit" className="hidden min-h-10 items-center px-3 text-dough/75 hover:text-dough md:inline-flex">
            {t("navVisit")}
          </a>
          <LangSwitch />
          <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-dough/25 px-4 text-dough/90 hover:border-gold">
            {t("navOrder")}
            {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] text-ink">{count}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
