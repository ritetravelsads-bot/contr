"use client"

import { useState, useEffect, useCallback } from "react"
import { Layers, X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FloorPlanTabsProps {
  floorPlans: string[]
  configurations?: Array<{
    type: string
    floor_plan_image?: string
  }>
  units?: Array<{
    type: string
    floor_plan_image?: string
  }>
}

export function FloorPlanTabs({ floorPlans, configurations, units }: FloorPlanTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Combine floor plans from all sources (units, configurations, and standalone)
  const plans: Array<{ label: string; image: string }> = []

  // Add unit floor plans with labels (priority)
  units?.forEach(unit => {
    if (unit.floor_plan_image) {
      plans.push({
        label: unit.type || "Unit",
        image: unit.floor_plan_image
      })
    }
  })

  // Add configuration floor plans with labels
  configurations?.forEach(config => {
    if (config.floor_plan_image && !plans.some(p => p.image === config.floor_plan_image)) {
      plans.push({
        label: config.type,
        image: config.floor_plan_image
      })
    }
  })

  // Add standalone floor plans
  floorPlans?.forEach((plan) => {
    // Avoid duplicates
    if (!plans.some(p => p.image === plan)) {
      plans.push({
        label: plans.length === 0 ? "Floor Plan" : `Plan ${plans.length + 1}`,
        image: plan
      })
    }
  })

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showLightbox) return
    
    if (e.key === "Escape") {
      setShowLightbox(false)
      setZoomLevel(1)
    } else if (e.key === "ArrowLeft") {
      setLightboxIndex(prev => (prev - 1 + plans.length) % plans.length)
      setZoomLevel(1)
    } else if (e.key === "ArrowRight") {
      setLightboxIndex(prev => (prev + 1) % plans.length)
      setZoomLevel(1)
    } else if (e.key === "+" || e.key === "=") {
      setZoomLevel(prev => Math.min(prev + 0.25, 3))
    } else if (e.key === "-") {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
    } else if (e.key === "0") {
      setZoomLevel(1)
    }
  }, [showLightbox, plans.length])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showLightbox])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setZoomLevel(1)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setZoomLevel(1)
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex(prev => (prev + 1) % plans.length)
    setZoomLevel(1)
  }
  
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex(prev => (prev - 1 + plans.length) % plans.length)
    setZoomLevel(1)
  }

  const zoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const zoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(1)
  }

  if (plans.length === 0) return null

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold mb-3 tracking-wide">
            <Layers className="h-3 w-3" />
            FLOOR PLANS
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Explore Floor Plans</h2>
          <p className="text-muted-foreground text-xs mt-1">
            {plans.length} floor plan{plans.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Tab Panel Container with max height */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg" style={{ maxHeight: "550px" }}>
          {/* Tab Navigation - Horizontal scrollable tabs */}
          <div className="border-b border-border bg-muted/30">
            <div className="flex overflow-x-auto scrollbar-hide">
              {plans.map((plan, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "flex-shrink-0 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 relative",
                    activeTab === index
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="whitespace-nowrap">{plan.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Image Container */}
          <div 
            className="relative bg-muted/50 cursor-zoom-in group"
            style={{ height: "400px" }}
            onClick={() => openLightbox(activeTab)}
          >
            <Image
              src={plans[activeTab].image}
              alt={`Floor Plan - ${plans[activeTab].label}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={activeTab === 0}
              loading={activeTab === 0 ? "eager" : "lazy"}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            
            {/* Zoom indicator - always visible on mobile, hover on desktop */}
            <div className="absolute top-3 right-3 flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox(activeTab)
                }}
                className="p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-lg text-white transition-colors"
                title="View fullscreen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation arrows on image */}
            {plans.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab(prev => (prev - 1 + plans.length) % plans.length)
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab(prev => (prev + 1) % plans.length)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full text-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Footer with label and count */}
          <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{plans[activeTab].label}</p>
              <p className="text-xs text-muted-foreground">
                {activeTab + 1} of {plans.length} floor plan{plans.length !== 1 ? "s" : ""}
              </p>
            </div>
            
            {/* Thumbnail dots for quick navigation */}
            {plans.length > 1 && plans.length <= 8 && (
              <div className="flex items-center gap-1.5">
                {plans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      activeTab === index
                        ? "bg-primary w-4"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    title={plans[index].label}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox with z-[9999] to be above navbar */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          onClick={closeLightbox}
        >
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10">
            {/* Left: Image info */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-white font-semibold">{plans[lightboxIndex].label}</p>
                <p className="text-white/60 text-sm">
                  {lightboxIndex + 1} of {plans.length}
                </p>
              </div>
            </div>

            {/* Center: Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-2 rounded-md hover:bg-white/20 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Zoom out (-)"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="px-3 py-1 text-white text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-md hover:bg-white/20 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Zoom in (+)"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={resetZoom}
                className="p-2 rounded-md hover:bg-white/20 text-white transition-colors"
                title="Reset zoom (0)"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            {/* Right: Close button */}
            <button
              onClick={closeLightbox}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 relative overflow-auto flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Navigation - Previous */}
            {plans.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image Container with zoom */}
            <div 
              className="relative transition-transform duration-200 ease-out"
              style={{ 
                transform: `scale(${zoomLevel})`,
                width: '80vw',
                height: '70vh',
                maxWidth: '1200px'
              }}
            >
              <Image
                src={plans[lightboxIndex].image}
                alt={`Floor Plan - ${plans[lightboxIndex].label}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Navigation - Next */}
            {plans.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {plans.length > 1 && (
            <div className="bg-black/80 border-t border-white/10 px-4 py-3">
              <div className="flex items-center justify-center gap-2 overflow-x-auto">
                {plans.map((plan, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(index)
                      setZoomLevel(1)
                    }}
                    className={cn(
                      "relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                      lightboxIndex === index
                        ? "border-white ring-2 ring-white/50"
                        : "border-white/30 opacity-60 hover:opacity-100 hover:border-white/60"
                    )}
                  >
                    <Image
                      src={plan.image}
                      alt={plan.label}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard hint */}
          <div className="absolute bottom-20 left-4 text-white/50 text-xs hidden md:block">
            Arrow keys: navigate | +/-: zoom | 0: reset | ESC: close
          </div>
        </div>
      )}
    </section>
  )
}
