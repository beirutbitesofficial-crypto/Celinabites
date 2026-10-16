import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  // Plain static site (HTML/CSS/JS in out/) — Hostinger serves it from public_html, no Node needed.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
