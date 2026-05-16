import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // We bundle the SANN wordmark as an SVG in /public/images/logo.svg.
    // Allow Next/Image to serve it (the content is trusted — it's ours).
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "scdn.line-apps.com" },
    ],
  },
};

export default nextConfig;
