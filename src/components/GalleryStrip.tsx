import { GALLERY_IMAGES } from "@/lib/site-data";

export default function GalleryStrip() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-4 pb-16 lg:pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-3.5">
        {GALLERY_IMAGES.map((g, i) => (
          <div key={g.label} className="relative rounded-sann-md overflow-hidden aspect-[3/4] group">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${i % 2 === 0 ? "sepia-[.1]" : "brightness-95"}`}
              style={{ backgroundImage: `url('${g.src}')` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(20,12,8,.6)_100%)]" />
            <div className="absolute bottom-3 left-3 text-white text-[0.8rem] font-medium">{g.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
