/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "*.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "countryroof.com",
      },
      {
        protocol: "https",
        hostname: "www.countryroof.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [70, 75, 80, 85],
  },
  experimental: {
    optimizePackageImports: ["@radix-ui", "lucide-react"],
    // Enable partial prerendering for faster page loads
    ppr: false,
  },
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  reactStrictMode: true,
  // Redirect www to non-www for both .in and .com domains
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.countryroof.in",
          },
        ],
        destination: "https://countryroof.in/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.countryroof.com",
          },
        ],
        destination: "https://countryroof.com/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
