"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, Text } from "./menu";

/** Every fixed string on the site, in Arabic and English. */
const strings = {
  navMenu: { ar: "القائمة", en: "Menu" },
  navOven: { ar: "الفرن", en: "The oven" },
  navVisit: { ar: "زورونا", en: "Visit" },
  navOrder: { ar: "اطلب", en: "Order" },
  switchLang: { ar: "English", en: "عربي" },

  heroScript: { ar: "طازة من الفرن", en: "fresh from the oven" },
  heroLine: { ar: "مناقيش · كرواسون · بيتزا · معجنات", en: "Manakish · Croissant · Pizza · Pastries" },
  heroOrder: { ar: "اطلب هلّق", en: "Order now" },
  heroWatch: { ar: "شوف كيف منخبز", en: "Watch us bake" },
  scroll: { ar: "انزل", en: "Scroll" },

  openUntil: { ar: "مفتوح هلّق · لل {time}", en: "Open now · until {time}" },
  closingSoon: { ar: "عم نسكّر قريباً · {time}", en: "Closing soon · {time}" },
  opensAt: { ar: "مسكّر · منفتح {time}", en: "Closed · opens {time}" },
  closedToday: { ar: "مسكّر اليوم", en: "Closed today" },

  ovenKicker: { ar: "كل يوم من الصبح", en: "Every morning, by hand" },
  ovenTitle: { ar: "من العجين للفرن", en: "Dough to oven" },
  step1: { ar: "عجينة بتختمر من الليل", en: "Dough, rested overnight" },
  step2: { ar: "بالإيد، بتنفرد وبتتبصّم", en: "Pressed open by hand" },
  step3: { ar: "زعتر بلدي وزيت زيتون", en: "Wild zaatar & olive oil" },
  step4: { ar: "عالفرن الحامي", en: "Into the hot oven" },
  step5: { ar: "دهبية، طالعة هلّق", en: "Golden, out right now" },
  step6: { ar: "ملفوفة، جاهزة لإلك", en: "Wrapped and ready for you" },

  storyKicker: { ar: "قصتنا", en: "Our story" },
  storyLine: {
    ar: "بسيلينا بايتس منفتح الفرن مع أول ضو. عجينة طازة كل يوم، زعتر وجبنة متل ما بتحبّن، وكل لقمة بطعم البيت.",
    en: "At Celina Bites the oven is lit at first light. Fresh dough every day, zaatar and cheese the way you like them — every bite tastes like home.",
  },
  statItems: { ar: "صنف عالقائمة", en: "things on the menu" },
  statDays: { ar: "أيام بالأسبوع", en: "days a week" },
  statHours: { ar: "من ٧ الصبح لـ ١١ بالليل", en: "7 am to 11 pm" },
  storyScript: { ar: "بطعم البيت", en: "tastes like home" },

  sigKicker: { ar: "يلّي الكل بيرجعلن", en: "The ones people come back for" },
  sigTitle: { ar: "المفضّلين", en: "Favourites" },

  menuKicker: { ar: "اطلب أونلاين", en: "Order online" },
  menuTitleA: { ar: "قائمة", en: "The" },
  menuTitleB: { ar: "الطعام", en: "Menu" },
  search: { ar: "دوّر: زعتر، جبنة، لوتس…", en: "Search zaatar, cheese, Lotus…" },
  searchLabel: { ar: "دوّر بالقائمة", en: "Search the menu" },
  noMatch: { ar: "ما في شي متل “{q}”.", en: "Nothing matches “{q}”." },
  clearSearch: { ar: "امسح البحث", en: "Clear search" },
  from: { ar: "من", en: "from" },
  add: { ar: "زيد", en: "Add" },
  addAria: { ar: "زيد {name} عالطلب", en: "Add {name} to order" },
  soldOut: { ar: "خلصت", en: "Sold out" },
  choose: { ar: "اختار", en: "choose" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  signature: { ar: "مميّز", en: "Signature" },
  isNew: { ar: "جديد", en: "New" },

  yourOrder: { ar: "طلبك", en: "Your order" },
  emptyCart: { ar: "بعد ما في شي — زيد من القائمة.", en: "Nothing here yet — add something from the menu." },
  delivery: { ar: "توصيل", en: "Delivery" },
  pickup: { ar: "استلام", en: "Pickup" },
  name: { ar: "الاسم", en: "Your name" },
  phone: { ar: "رقم التلفون", en: "Phone" },
  address: { ar: "العنوان (البناية، الطابق، المنطقة)", en: "Delivery address (building, floor, area)" },
  notes: { ar: "ملاحظات — بلا بندورة، زيادة جبنة…", en: "Notes — no tomato, extra cheese…" },
  clear: { ar: "امسح الطلب", en: "Clear order" },
  total: { ar: "المجموع", en: "Total" },
  sendWa: { ar: "ابعت الطلب عالواتساب", en: "Send order on WhatsApp" },
  cartFoot: { ar: "الأسعار بالليرة اللبنانية. منأكّدلك الطلب ووقت التوصيل عالواتساب.", en: "Prices in Lebanese pounds. We confirm your order and delivery time on WhatsApp." },
  errEmpty: { ar: "طلبك فاضي.", en: "Your order is empty." },
  errName: { ar: "زيد اسمك ورقم تلفونك.", en: "Please add your name and phone number." },
  errAddress: { ar: "زيد عنوان التوصيل.", en: "Please add the delivery address." },
  close: { ar: "سكّر", en: "Close" },
  less: { ar: "شيل وحدة {name}", en: "One less {name}" },
  more: { ar: "زيد وحدة {name}", en: "One more {name}" },
  cartPill: { ar: "طلبك", en: "Your order" },
  cartPillAria: { ar: "افتح طلبك: {count} أصناف، {total}", en: "Open your order: {count} items, {total}" },

  visitKicker: { ar: "جوعان؟", en: "Hungry?" },
  visitTitleA: { ar: "طالعة من الفرن،", en: "Out of the oven," },
  visitTitleB: { ar: "وواصلة لعندك.", en: "on its way to you." },
  startOrder: { ar: "ابدأ طلبك", en: "Start an order" },
  findUs: { ar: "لاقونا", en: "find us" },
  hoursTitle: { ar: "ساعات العمل", en: "Opening hours" },
  everyDay: { ar: "كل يوم", en: "Every day" },
  closed: { ar: "مسكّر", en: "Closed" },
  delivPick: { ar: "توصيل واستلام · طلبيات للمناسبات", en: "Delivery & pickup · catering orders" },
  openMaps: { ar: "افتح عالخريطة", en: "Open in Maps" },
  call: { ar: "اتصل", en: "Call" },
  directions: { ar: "الطريق", en: "Directions" },
  catering: { ar: "طلبيات المناسبات", en: "Catering" },
  waHello: { ar: "مرحبا سيلينا بايتس!", en: "Hello Celina Bites!" },

  footRights: { ar: "كل الحقوق محفوظة", en: "All rights reserved" },
} satisfies Record<string, Text>;

export type Key = keyof typeof strings;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  /** Pick the right side of a { ar, en } pair. */
  tx: (text: Text) => string;
};

const LangContext = createContext<Ctx | null>(null);
const STORAGE = "celinabites.lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved === "en" || saved === "ar") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => {
        let s: string = strings[key][lang];
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
        return s;
      },
      tx: (text) => text[lang],
    }),
    [lang, setLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
