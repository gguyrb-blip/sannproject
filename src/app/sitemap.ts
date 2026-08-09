import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sannstay.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/sann-stay-hatyai", priority: 0.95, freq: "weekly" },
    { path: "/sann-thungsao-hostel", priority: 0.95, freq: "weekly" },
    { path: "/hatyai-private-house-near-lee-garden", priority: 0.9, freq: "weekly" },
    { path: "/ms/penginapan-hatyai-dekat-lee-garden", priority: 0.95, freq: "weekly" },
    { path: "/book", priority: 0.9, freq: "weekly" },
    { path: "/gallery", priority: 0.7, freq: "monthly" },
    { path: "/location", priority: 0.6, freq: "monthly" },
    { path: "/checkin", priority: 0.5, freq: "monthly" },
    { path: "/links", priority: 0.4, freq: "monthly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
  ];
  return routes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
