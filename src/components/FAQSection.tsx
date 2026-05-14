"use client";

import { useState } from "react";
import { CONTACT, FAQS } from "@/lib/site-data";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-sann-off px-6 lg:px-20 py-20 lg:py-24">
      <header className="rv">
        <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
          Frequently Asked
        </p>
        <h2 className="font-display text-3xl lg:text-4xl text-sann-text font-normal leading-[1.15]">
          Got a <em className="italic text-sann-red">Question?</em>
        </h2>
        <div className="w-9 h-0.5 bg-sann-red mt-5 opacity-40" />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-16 items-start mt-10">
        <div className="rv">
          <p className="text-[0.9rem] text-sann-text-md leading-[1.8]">
            Have more questions? Feel free to reach us via LINE anytime —
            we&apos;re available 24/7.
          </p>
          <a
            href={CONTACT.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 bg-sann-red hover:bg-sann-red-dk text-white px-6 py-3 rounded-sm text-[0.73rem] tracking-[0.16em] uppercase font-semibold transition-colors"
          >
            Add us on LINE
          </a>
        </div>
        <div className="flex flex-col">
          {FAQS.map((f, i) => {
            const open = i === openIdx;
            return (
              <div
                key={f.q}
                className="border-b border-sann-red/10"
              >
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex justify-between items-center py-5 text-left gap-4 group"
                >
                  <h4
                    className={`font-display text-base lg:text-[1rem] font-normal transition-colors ${
                      open ? "text-sann-red" : "text-sann-text group-hover:text-sann-red"
                    }`}
                  >
                    {f.q}
                  </h4>
                  <span
                    className={`text-lg text-sann-red transition-transform flex-shrink-0 ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all ${
                    open ? "max-h-[300px] pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-[0.84rem] text-sann-text-md leading-[1.75]">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
