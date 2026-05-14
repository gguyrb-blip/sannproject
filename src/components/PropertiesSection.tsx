import { PROPERTIES } from "@/lib/site-data";
import PropertyCard from "./PropertyCard";

export default function PropertiesSection() {
  return (
    <section
      id="properties"
      className="bg-sann-cream px-6 lg:px-20 py-20 lg:py-24"
    >
      <header className="rv mb-12">
        <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
          Our Properties
        </p>
        <h2 className="font-display text-3xl lg:text-4xl text-sann-text font-normal leading-[1.15]">
          Two Unique Stays
          <br />
          in <em className="italic text-sann-red">Hat Yai</em>
        </h2>
        <div className="w-9 h-0.5 bg-sann-red mt-5 opacity-40" />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PROPERTIES.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
