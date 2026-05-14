import { GALLERY_IMAGES } from "@/lib/site-data";

export default function GalleryStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 h-[200px] lg:h-[280px] overflow-hidden">
      {GALLERY_IMAGES.map((g) => (
        <div key={g.label} className="relative overflow-hidden group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110 brightness-75 saturate-[.8] group-hover:brightness-100 group-hover:saturate-100"
            style={{ backgroundImage: `url('${g.src}')` }}
          />
          <span className="absolute bottom-0 inset-x-0 px-3 py-2 text-sann-beige text-[0.58rem] tracking-[0.2em] uppercase font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(to_top,rgba(42,31,24,0.82)_0%,transparent_100%)]">
            {g.label}
          </span>
        </div>
      ))}
    </div>
  );
}
