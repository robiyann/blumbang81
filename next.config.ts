import type { NextConfig } from "next";

const getR2Host = () => {
  const url = process.env.R2_PUBLIC_URL || "";
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
};

const r2Host = getR2Host();

// ─── HTTP Security Headers ────────────────────────────────────
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Disallow embedding in frames (clickjacking)
  { key: "X-Frame-Options",           value: "DENY" },
  // XSS protection hint for legacy browsers
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  // Only send origin in Referer header
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Limit browser features
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  // Content-Security-Policy — allow images from R2 and Google Maps embed
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://maps.googleapis.com",
      "img-src 'self' data: blob: https://*.ggpht.com https://*.google.com https://*.gstatic.com" + (r2Host ? " https://" + r2Host : ""),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com",
      "connect-src 'self' https://*.google.com https://*.googleapis.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      ...(r2Host
        ? [
            {
              protocol: "https" as const,
              hostname: r2Host,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
