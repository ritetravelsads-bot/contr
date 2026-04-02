"use client"

import type React from "react"
import { Suspense } from "react"
import { usePathname } from "next/navigation"
import MegaMenuHeader from "./mega-menu-header"
import Footer from "./footer"
import BottomNav from "./bottom-nav"
import WhatsAppButton from "@/components/ui/whatsapp-button"
import NavigationProgress from "./navigation-progress"
import RoutePrefetcher from "./route-prefetcher"

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
      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </>
  )
}
