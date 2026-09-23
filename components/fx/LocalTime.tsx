"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo",
  hour: "2-digit",
  minute: "2-digit",
});

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(timer);
}

/** Live local time in Giza — ticks client-side, renders "--:--" on the server. */
export function LocalTime({ className = "" }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, () => formatter.format(new Date()), () => "--:--");
  return <span className={className}>{time}</span>;
}
