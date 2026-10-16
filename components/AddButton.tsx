"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { type Item, money } from "@/lib/menu";

/** "+" for simple items; for items with sizes/styles, a row of choice chips (or a bottom sheet when compact). */
export default function AddButton({ item, className = "", compact = false }: { item: Item; className?: string; compact?: boolean }) {
  const { add, qtyOf } = useCart();
  const { t, tx, lang } = useLang();
  const [picking, setPicking] = useState(false);
  const qty = qtyOf(item.id);
  const choices = item.variants && item.variants.length > 1 ? item.variants : null;
  const onAdd = () => (choices ? setPicking(true) : add(item.id, item.variants ? 0 : undefined));
  const name = tx(item.name);

  if (item.soldOut) return <span className={`text-[11px] uppercase tracking-[0.3em] opacity-50 ${className}`}>{t("soldOut")}</span>;

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={onAdd}
          className={`grid h-10 w-10 place-items-center rounded-full bg-gold text-ink shadow-[0_6px_16px_-4px_rgba(212,168,67,0.8)] transition-transform active:scale-90 ${className}`}
          aria-label={t("addAria", { name })}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2.2" />
          </svg>
          {qty > 0 && (
            <span key={qty} className="pop absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-dough px-1 text-[10px] font-bold text-ink">
              {qty}
            </span>
          )}
        </button>
        {choices && picking && <ChoiceSheet item={item} onPick={(i) => (add(item.id, i), setPicking(false))} onClose={() => setPicking(false)} />}
      </>
    );
  }

  if (choices && picking) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label={`${t("choose")} ${name}`}>
        {choices.map((c, i) => (
          <button
            key={c.label.en}
            type="button"
            onClick={() => {
              add(item.id, i);
              setPicking(false);
            }}
            className="min-h-10 rounded-full bg-gold px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-dough"
          >
            {tx(c.label)} · <span dir="ltr">{money(c.price, lang)}</span>
          </button>
        ))}
        <button type="button" onClick={() => setPicking(false)} className="min-h-10 px-2 text-xs opacity-60 hover:opacity-100" aria-label={t("cancel")}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      className={`relative inline-flex min-h-10 items-center gap-2 rounded-full bg-gold px-4 text-xs font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-dough ${className}`}
      aria-label={t("addAria", { name })}
    >
      <svg className="h-3 w-3" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2" />
      </svg>
      {t("add")}
      {qty > 0 && (
        <span key={qty} className="pop ms-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] text-dough">
          {qty}
        </span>
      )}
    </button>
  );
}

/** Bottom sheet for picking a size / style. */
function ChoiceSheet({ item, onPick, onClose }: { item: Item; onPick: (index: number) => void; onClose: () => void }) {
  const { t, tx, lang } = useLang();
  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={`${t("choose")} ${tx(item.name)}`}>
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label={t("close")} />
      <div className="relative w-full max-w-md rounded-t-[28px] bg-ink-2 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-start sm:rounded-[28px]">
        <p className="font-script text-3xl leading-none text-gold">{t("choose")}</p>
        <h3 className="mt-1 font-serif text-2xl">{tx(item.name)}</h3>
        <div className="mt-5 grid gap-2">
          {item.variants!.map((c, i) => (
            <button key={c.label.en} type="button" onClick={() => onPick(i)} className="group flex min-h-13 items-center justify-between rounded-2xl bg-ink px-5 py-3.5 text-start transition-colors hover:bg-gold hover:text-ink">
              <span className="font-medium">{tx(c.label)}</span>
              <span dir="ltr" className="font-serif text-gold group-hover:text-ink">
                {money(c.price, lang)}
              </span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-sm text-dough/50">
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
