import { Suspense } from "react"
import dynamic from "next/dynamic"
import BannerSlider from "@/components/sections/banner-slider"
import AdvancedSearch from "@/components/sections/advanced-search"

// Lazy load below-the-fold components for better LCP
const RecentlyViewed = dynamic(() => import("@/components/sections/recently-viewed"), {
  ssr: true,
  loading: () => <div className="h-32" />,
})

const FeaturedVideoProperties = dynamic(() => import("@/components/sections/featured-video-properties"), {
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
})

const TrendingLocations = dynamic(() => import("@/components/sections/trending-locations"), {
  ssr: true,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse" />,
})

const DynamicSections = dynamic(() => import("@/components/sections/dynamic-sections"), {
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
})

const FeaturedDevelopers = dynamic(() => import("@/components/sections/featured-developers"), {
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
})

const WhyChooseUs = dynamic(() => import("@/components/sections/why-choose-us"), {
  ssr: true,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse" />,
})

const CTA = dynamic(() => import("@/components/sections/cta"), {
  ssr: true,
  loading: () => <div className="h-48 bg-slate-50 animate-pulse" />,
})

export default function Home() {
  return (
    <main>
      {/* Critical above-the-fold content - loads immediately */}
      <BannerSlider />
      <AdvancedSearch />
      
      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<div className="h-32" />}>
        <RecentlyViewed />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse" />}>
        <FeaturedVideoProperties />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse" />}>
        <TrendingLocations />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse" />}>
        <DynamicSections />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse" />}>
        <FeaturedDevelopers />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse" />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-slate-50 animate-pulse" />}>
        <CTA />
      </Suspense>
    </main>
  )
}
