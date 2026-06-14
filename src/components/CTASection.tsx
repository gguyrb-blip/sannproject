import Link from "next/link";
import { CONTACT } from "@/lib/site-data";
import { ArrowR, DotGrid } from "./icons";

const STEPS = [
  "Click the link in your email",
  "Upload passport · 2 min",
  "Get door code 1 day before arrival",
];

export default function CTASection() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-4 pb-20 lg:pb-24">
      <div className="relative overflow-hidden rounded-sann-2xl bg-[linear-gradient(135deg,#4A342E_0%,#2A1F1B_100%)] text-white p-8 sm:p-12 lg:p-14">
        <div className="absolute -top-12 -right-12 opacity-[0.15] pointer-events-none">
          <DotGrid n={14} gap={22} r={1.4} size={300} />
        </div>

        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <div className="font-mono text-[0.7rem] text-sann-red-lt tracking-[0.18em] uppercase mb-3">
              Already booked?
            </div>
            <h2 className="font-display font-normal text-4xl lg:text-5xl leading-[1.05] m-0">
              Skip the queue. <br />
              <i>Pre check-in now.</i>
            </h2>
            <p className="text-sm lg:text-[0.95rem] text-white/70 leading-relaxed mt-3.5 max-w-md">
              Fill in your details and upload your passport before arrival — your
              door code is ready the day before you check in.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/checkin"
                className="inline-flex items-center gap-2 bg-sann-red hover:bg-sann-red-dk text-white font-medium px-6 py-4 rounded-2xl transition-colors"
              >
                Start pre check-in <ArrowR size={16} />
              </Link>
              <a
                href={CONTACT.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border border-white/25 hover:border-white/50 text-white font-medium px-6 py-4 rounded-2xl transition-colors"
              >
                Message us on LINE
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {STEPS.map((l, i) => (
              <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-2xl">
                <span className="font-mono text-lg font-medium text-sann-red-lt min-w-[28px]">0{i + 1}</span>
                <span className="text-sm text-white">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
