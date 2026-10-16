import { site } from "./site";
import type { Lang } from "./menu";

/** Day of week + minutes since midnight in Beirut, whatever the visitor's timezone. */
export function beirutNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Beirut", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dow, min: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type Status =
  | { state: "open" | "soon"; closesAt: number }
  | { state: "closed"; opensAt: number | null; tomorrow: boolean };

export function getStatus(date = new Date()): Status {
  const { dow, min } = beirutNow(date);
  const today = site.hours[dow];
  if (today && min >= today.open && min < today.close) {
    return { state: today.close - min <= 30 ? "soon" : "open", closesAt: today.close };
  }
  if (today && min < today.open) return { state: "closed", opensAt: today.open, tomorrow: false };
  const next = site.hours[(dow + 1) % 7];
  return { state: "closed", opensAt: next ? next.open : null, tomorrow: true };
}

export function fmtMin(m: number, lang: Lang) {
  const h = Math.floor(m / 60) % 24;
  const mm = m % 60;
  const h12 = h % 12 || 12;
  const suffix = lang === "ar" ? (h < 12 ? "ص" : "م") : h < 12 ? "am" : "pm";
  return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${suffix}`;
}

export const dayNames = {
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
