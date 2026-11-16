import localFont from "next/font/local";

/**
 * LINE Seed Sans TH — LINE's own typeface, used for every Thai letter on the
 * site: paragraphs, buttons and headings alike.
 *
 * It is limited to the Thai block (unicode-range), so English text keeps the
 * site's own faces — Geist for text, Instrument Serif for headings — and a page
 * with no Thai on it never downloads this file. It sits in every font stack in
 * tailwind.config.ts after the Latin face.
 *
 * © LY Corporation, SIL Open Font License 1.1 (free for commercial use and for
 * embedding in a website; the licence travels with the files, see OFL.txt).
 * Downloaded from seed.line.me (LINE_Seed_Sans_TH.zip, v1.003, Web/WOFF2).
 * Only Regular and Bold are shipped: ~30 KB each.
 */
export const lineSeed = localFont({
  src: [
    { path: "../fonts/line-seed-sans-th/LINESeedSansTH_W_Rg.woff2", weight: "400", style: "normal" },
    { path: "../fonts/line-seed-sans-th/LINESeedSansTH_W_Bd.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-line-seed",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0E01-0E5B, U+200B-200D, U+25CC" }],
});
