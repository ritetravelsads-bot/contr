/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "*.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "countryroof.in" },
      { protocol: "https", hostname: "www.countryroof.in" },
    ],
    formats: ["image/avif", "image/webp"],
    // Optimized device sizes for mobile-first LCP
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configure allowed quality values for images
    qualities: [75, 80, 85],
    // Minimize image memory for faster decoding
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ["@radix-ui", "lucide-react", "date-fns", "recharts"],
    ppr: false,
  },
  transpilePackages: [],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  reactStrictMode: true,
  // Disable legacy browser polyfills for modern browsers only
  // This reduces bundle size by ~14KB
  swcMinify: true,
  
  // Disable caching for API routes and pages to ensure fresh data
  async headers() {
    return [
      {
        // Apply to all API routes - critical for auth and data
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Surrogate-Control", value: "no-store" },
        ],
      },
      {
        // Auth API routes - extra strict no-cache (prevents session sharing)
        source: "/api/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Surrogate-Control", value: "no-store" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to admin pages
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to agent pages
        source: "/agent/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to buyer/builder dashboard pages
        source: "/buyer/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to builder dashboard pages
        source: "/builder/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to dashboard pages
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Cache banner images aggressively for better LCP
        source: "/banners/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache home banner images (home-banner-1.jpg, etc.)
        source: "/:filename(home-banner-.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // 1. Existing www redirects
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.countryroof.in" }],
        destination: "https://countryroof.in/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "roof.countryroof.in" }],
        destination: "https://countryroof.in/",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "roof.countryroof.in" }],
        destination: "https://countryroof.in/:path+",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
