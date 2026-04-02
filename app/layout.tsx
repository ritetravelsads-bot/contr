import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "@/styles/blog-content.css"
import FrontendLayout from "@/components/layout/frontend-layout"
import CustomHeadTags from "@/components/layout/custom-head-tags"

const geist = Geist({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Country Roof Real Estate | Buy & Sell Property in Gurgaon",
  description:
    "Find the best property in Gurgaon including flats, plots, villas and commercial spaces. Buy, sell or rent property with trusted real estate experts.",
  keywords: [
    "Gurgaon Property",
    "Real Estate Gurgaon",
    "Buy Property in Gurgaon",
    "Property for Sale in Gurgaon",
    "Commercial Property Gurgaon",
  ],
  authors: [{ name: "CountryRoof" }],
  robots: {
    index: false,
    follow: false,
  },
  verification: {
    google: "HMLmt_V-xGPk7KOvW60EO-cNggppOdM6OHT47vFLdQM",
  },
  icons: {
    icon: "/fav.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://countryroof.com",
    siteName: "CountryRoof",
    title: "Premium Property Marketplace | CountryRoof",
    description: "Find and list premium properties on CountryRoof marketplace.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CountryRoof Property Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CountryRoof | Premium Property Marketplace",
    description: "Discover properties, connect with agents, secure transactions.",
    images: ["/og-image.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        
        {/* Preload critical LCP images - mobile first */}
        <link
          rel="preload"
          as="image"
          href="/banners/home-mob-banner-1.jpg"
          media="(max-width: 767px)"
          fetchPriority="high"
          type="image/jpeg"
        />
        <link
          rel="preload"
          as="image"
          href="/home-banner-1.jpg"
          media="(min-width: 768px)"
          fetchPriority="high"
          type="image/jpeg"
        />
        <link
          rel="preload"
          as="image"
          href="/images/logo.png"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "CountryRoof",
              description: "Premium property marketplace connecting buyers, sellers, and agents",
              url: "https://countryroof.com",
              logo: "/logo.png",
              image: "/og-image.png",
            }),
          }}
        />
        {/* @ts-expect-error Server Component */}
        <CustomHeadTags />
      </head>
      <body className={`${geist.className} antialiased`}>
        <FrontendLayout>
          {children}
        </FrontendLayout>
        <Analytics />
      </body>
    </html>
  )
}
