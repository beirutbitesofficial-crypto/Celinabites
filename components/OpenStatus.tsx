"use client";

import { useEffect, useState } from "react";
import { fmtMin, getStatus, type Status } from "@/lib/hours";
import { useLang } from "@/lib/i18n";

/** "Open now · until 11 pm" — computed in Beirut time, refreshed every minute. Renders nothing until mounted. */
export default function OpenStatus({ className = "" }: { className?: string }) {
  const { t, lang } = useLang();
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return <span className={`invisible ${className}`}>·</span>;

  const open = status.state !== "closed";
  let text: string;
  if (status.state !== "closed") text = t(status.state === "open" ? "openUntil" : "closingSoon", { time: fmtMin(status.closesAt, lang) });
  else if (status.opensAt === null) text = t("closedToday");
  else text = t("opensAt", { time: fmtMin(status.opensAt, lang) });

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <i className={`pulse-dot block h-2 w-2 rounded-full ${open ? (status.state === "soon" ? "bg-crust text-crust" : "bg-[#7BC27A] text-[#7BC27A]") : "bg-ember/80 text-transparent"}`} aria-hidden="true" />
      {text}
    </span>
  );
}
