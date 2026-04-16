"use client"

import type React from "react"
import { Suspense, lazy } from "react"
import { usePathname } from "next/navigation"
import MegaMenuHeader from "./mega-menu-header"
import NavigationProgress from "./navigation-progress"
import RoutePrefetcher from "./route-prefetcher"

// Lazy load non-critical layout components to reduce initial bundle
const Footer = lazy(() => import("./footer"))
const BottomNav = lazy(() => import("./bottom-nav"))
const WhatsAppButton = lazy(() => import("@/components/ui/whatsapp-button"))
// Lazy load Toaster to defer next-themes loading
const LazyToaster = lazy(() => import("@/components/ui/sonner").then(mod => ({ default: mod.Toaster })))

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith("/admin") || 
                         pathname?.startsWith("/builder") || 
                         pathname?.startsWith("/buyer") || 
                         pathname?.startsWith("/dashboard") ||
                         pathname?.startsWith("/agent")
  
  // Don't render the mega menu header and footer for dashboard pages
  if (isDashboardPage) {
    return <>{children}</>
  }
  
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <RoutePrefetcher />
      <MegaMenuHeader />
      {children}
      <Suspense fallback={<div className="min-h-[600px] bg-gradient-to-b from-gray-50 to-white" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <Suspense fallback={null}>
        <LazyToaster position="top-center" richColors closeButton />
      </Suspense>
    </>
  )
}
