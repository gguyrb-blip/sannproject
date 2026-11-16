"use client";
// site-lang — the one Thai/English switch for the website.
//
// The header's ไทย / EN buttons set it; every section that has both languages
// reads it through useSiteLang and changes the moment it is pressed. It is the
// same key /book already keeps ("book_lang"), so a guest who chose Thai there
// lands on a Thai home page, and the other way round.
//
// Order of say: ?lang= in the address (a link shared in Thai stays Thai), then
// what the guest chose before, then their browser's language.
import { useEffect, useState } from "react";

export type SiteLang = "th" | "en";

const KEY = "book_lang";
const EVENT = "sann-lang";

export function readSiteLang(): SiteLang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "th" || q === "en") return q;
    const saved = localStorage.getItem(KEY);
    if (saved === "th" || saved === "en") return saved;
  } catch { /* private mode */ }
  return navigator.language?.toLowerCase().startsWith("th") ? "th" : "en";
}

export function setSiteLang(lang: SiteLang) {
  try { localStorage.setItem(KEY, lang); } catch { /* private mode */ }
  document.documentElement.lang = lang;
  // An address that names a language must not undo the switch on reload.
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u); }
  } catch { /* old browser */ }
  window.dispatchEvent(new CustomEvent<SiteLang>(EVENT, { detail: lang }));
}

/** The site's language, and the switch. Starts as English on the server. */
export function useSiteLang(): [SiteLang, (lang: SiteLang) => void] {
  const [lang, setLang] = useState<SiteLang>("en");
  useEffect(() => {
    const l = readSiteLang();
    setLang(l);
    document.documentElement.lang = l;
    const on = (e: Event) => setLang((e as CustomEvent<SiteLang>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return [lang, setSiteLang];
}
