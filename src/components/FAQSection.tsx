"use client";
import { useState } from "react";
import { CONTACT, FAQS } from "@/lib/site-data";
import { Plus, Minus, ArrowR } from "./icons";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-16 lg:py-24 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16">
      {/* Left */}
      <div>
        <div className="font-mono text-xs text-sann-text-lt tracking-[0.18em] uppercase mb-2.5">FAQ</div>
        <h2 className="font-display font-normal text-4xl lg:text-[3.2rem] leading-[1.05] text-sann-text m-0">
          Got a <i className="text-sann-red">question?</i>
        </h2>
        <p className="text-sm text-sann-text-lt leading-relaxed mt-3.5 max-w-xs">
          Have more questions? Reach us via LINE anytime — we&apos;re available 24/7.
        </p>
        <a
          href={CONTACT.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-3.5 bg-sann-bg2 rounded-sann-md p-4 max-w-sm hover:shadow-sann-sm transition-shadow"
        >
          <div className="w-11 h-11 rounded-xl bg-[#06C755] text-white flex items-center justify-center shrink-0 text-xl font-bold">
            L
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-sann-text">Add us on LINE</div>
            <div className="font-mono text-xs text-sann-text-lt">{CONTACT.lineHandle} · 24/7</div>
          </div>
          <ArrowR size={16} className="text-sann-text-lt" />
        </a>
      </div>

      {/* Right — accordion */}
      <div>
        {FAQS.map((f, i) => {
          const open = i === openIdx;
          return (
            <div key={f.q} className="border-b border-sann-line">
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex justify-between items-center gap-4 py-4.5 text-left group"
                style={{ paddingTop: 18, paddingBottom: 18 }}
              >
                <span className={`text-base lg:text-lg font-medium transition-colors ${open ? "text-sann-red" : "text-sann-text group-hover:text-sann-red"}`}>
                  {f.q}
                </span>
                <span className="w-8 h-8 rounded-full bg-sann-bg2 flex items-center justify-center shrink-0 text-sann-text">
                  {open ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {open && (
                <p className="text-sm text-sann-text-lt leading-relaxed pb-5 max-w-2xl whitespace-pre-line">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
