"use client";

import { useEffect, useRef, useState } from "react";
import { type Customer, type OrderType, lineLabel, orderMessage, useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { findItem, money } from "@/lib/menu";
import { whatsappLink } from "@/lib/site";
import { LogoMark } from "./Logo";

/** Floating cart button — shows once something is in the order. */
export function CartPill() {
  const { count, total, setOpen, pulse } = useCart();
  const { t, lang } = useLang();
  if (count === 0) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-5 end-5 z-50 flex min-h-14 items-center gap-3 rounded-full bg-gold pe-6 ps-3 text-ink shadow-[0_14px_40px_-10px_rgba(212,168,67,0.7)] transition-transform hover:-translate-y-0.5 md:bottom-8 md:end-8"
      aria-label={t("cartPillAria", { count, total: money(total, lang) })}
    >
      <span key={pulse} className="pop grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-bold text-dough">
        {count}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.25em]">{t("cartPill")}</span>
      <span dir="ltr" className="font-serif text-lg">
        {money(total, lang)}
      </span>
    </button>
  );
}

export function CartDrawer() {
  const { lines, total, open, setOpen, setQty, clear } = useCart();
  const { t, lang } = useLang();
  const [type, setType] = useState<OrderType>("delivery");
  const [c, setC] = useState<Customer>({ name: "", phone: "", address: "", notes: "" });
  const [error, setError] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen]);

  const send = () => {
    if (!lines.length) return setError(t("errEmpty"));
    if (!c.name.trim() || !c.phone.trim()) return setError(t("errName"));
    if (type === "delivery" && !c.address.trim()) return setError(t("errAddress"));
    setError("");
    window.open(whatsappLink(orderMessage(lines, total, type, c)), "_blank", "noopener");
  };

  const field = "min-h-12 w-full rounded-2xl border border-dough/12 bg-ink px-4 text-sm text-dough placeholder:text-dough/35 focus:border-gold/60 focus:outline-none";

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t("yourOrder")}
        className={`absolute inset-y-0 end-0 flex w-full max-w-[460px] flex-col bg-ink-2 shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-dough/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <h2 className="font-serif text-2xl">{t("yourOrder")}</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-xl text-dough/70 hover:bg-dough/10" aria-label={t("close")}>
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="py-16 text-center text-dough/50">{t("emptyCart")}</p>
          ) : (
            <ul>
              {lines.map((l) => {
                const item = findItem(l.id);
                if (!item) return null;
                const { name, choice } = lineLabel(item, l.variant, lang);
                return (
                  <li key={l.key} className="flex items-center gap-4 border-b border-dashed border-dough/10 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-lg leading-tight">{name}</p>
                      {choice && <p className="text-xs text-dough/50">{choice}</p>}
                      <p dir="ltr" className="mt-1 text-sm text-gold rtl:text-right">
                        {money(l.price * l.qty, lang)}
                      </p>
                    </div>
                    <div className="flex items-center rounded-full border border-dough/15" dir="ltr">
                      <button type="button" className="grid h-9 w-9 place-items-center text-lg" onClick={() => setQty(l.key, l.qty - 1)} aria-label={t("less", { name })}>
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                      <button type="button" className="grid h-9 w-9 place-items-center text-lg" onClick={() => setQty(l.key, l.qty + 1)} aria-label={t("more", { name })}>
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {lines.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-1 rounded-full bg-ink p-1">
                {(["delivery", "pickup"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setType(k)}
                    className={`min-h-10 rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-colors ${type === k ? "bg-gold text-ink" : "text-dough/60"}`}
                  >
                    {t(k)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={field} placeholder={t("name")} autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
                <input className={field} placeholder={t("phone")} type="tel" autoComplete="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
              </div>
              {type === "delivery" && (
                <input className={field} placeholder={t("address")} autoComplete="street-address" value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} />
              )}
              <textarea className={`${field} min-h-20 py-3`} placeholder={t("notes")} value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} />
              <button type="button" onClick={clear} className="text-xs text-dough/40 underline hover:text-dough/70">
                {t("clear")}
              </button>
            </div>
          )}
        </div>

        <footer className="border-t border-dough/10 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-dough/55">{t("total")}</span>
            <span dir="ltr" className="font-serif text-3xl">
              {money(total, lang)}
            </span>
          </div>
          {error && <p className="mb-3 text-sm text-[#FF8A7A]">{error}</p>}
          <button
            type="button"
            onClick={send}
            disabled={!lines.length}
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-gold text-xs font-bold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-dough disabled:opacity-40"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t("sendWa")}
          </button>
          <p className="mt-3 text-center text-[11px] text-dough/40">{t("cartFoot")}</p>
        </footer>
      </div>
    </div>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}
