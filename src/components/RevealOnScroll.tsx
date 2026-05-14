"use client";

import { useEffect } from "react";

/**
 * Adds the `.on` class to any element with `.rv` once it enters the viewport.
 * Mount once near the root.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            window.setTimeout(() => el.classList.add("on"), i * 60);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
