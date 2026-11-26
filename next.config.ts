import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // "standalone" is for Docker/self-hosted. Remove it on Vercel to avoid
  // bundling source maps and unnecessary files into every serverless function.
  // output: "standalone",
  devIndicators: false,
  transpilePackages: ["webjoz-ui"],
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  // Exclude server-side source maps from the deployed function bundle.
  // Source maps are only useful for local debugging, not on the edge/serverless runtime.
  productionBrowserSourceMaps: false,
  // Exclude source map files from the output file tracing (reduces Vercel function storage ~70%)
  outputFileTracingExcludes: {
    "*": [
      "**/.next/server/chunks/ssr/*.map",
      "**/.next/server/chunks/*.map",
      "**/.next/server/app/**/*.map",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://connect.facebook.net https://analytics.tiktok.com https://app.sandbox.midtrans.com https://app.midtrans.com https://snap-assets.sandbox.midtrans.com https://snap-assets.midtrans.com https://api.sandbox.midtrans.com https://api.midtrans.com https://pay.google.com https://gwk.gopayapi.com https://www.googletagmanager.com https://o.alicdn.com https://g.alicdn.com https://www.paypal.com https://sandbox.paypal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; img-src 'self' blob: data: https: http:; media-src 'self' https://res.cloudinary.com https: blob: data:; font-src 'self' data: https://fonts.gstatic.com https://res.cloudinary.com; frame-src 'self' https://accounts.google.com https://*.facebook.com https://*.facebook.net https://www.openstreetmap.org https://app.sandbox.midtrans.com https://app.midtrans.com https://www.paypal.com https://sandbox.paypal.com https://www.sandbox.paypal.com; connect-src 'self' https: http: ws: wss:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
