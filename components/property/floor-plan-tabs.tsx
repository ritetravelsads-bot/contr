"use client"

import { useState, useEffect, useCallback } from "react"
import { Layers, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
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
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({})

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
  floorPlans?.forEach((plan, index) => {
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
    } else if (e.key === "ArrowLeft") {
      setLightboxIndex(prev => (prev - 1 + plans.length) % plans.length)
    } else if (e.key === "ArrowRight") {
      setLightboxIndex(prev => (prev + 1) % plans.length)
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
    setShowLightbox(true)
  }

  const nextImage = () => setLightboxIndex(prev => (prev + 1) % plans.length)
  const prevImage = () => setLightboxIndex(prev => (prev - 1 + plans.length) % plans.length)

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
                  {activeTab === index && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
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
            {!imageLoaded[activeTab] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={plans[activeTab].image}
              alt={`Floor Plan - ${plans[activeTab].label}`}
              className={cn(
                "w-full h-full object-contain p-4 transition-opacity duration-300",
                imageLoaded[activeTab] ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(prev => ({ ...prev, [activeTab]: true }))}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Zoom indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox(activeTab)
                }}
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white transition-colors"
                title="View fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
            
            {/* Click hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to enlarge
            </div>

            {/* Navigation arrows on image */}
            {plans.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab(prev => (prev - 1 + plans.length) % plans.length)
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab(prev => (prev + 1) % plans.length)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
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

      {/* Enhanced Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation - Previous */}
          {plans.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Navigation - Next */}
          {plans.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Main Image */}
          <div 
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={plans[lightboxIndex].image}
              alt={`Floor Plan - ${plans[lightboxIndex].label}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-6 px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{plans[lightboxIndex].label}</p>
                <p className="text-white/60 text-sm">
                  {lightboxIndex + 1} of {plans.length} floor plans
                </p>
              </div>
              
              {/* Thumbnail strip */}
              {plans.length > 1 && (
                <div className="hidden md:flex items-center gap-2">
                  {plans.map((plan, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxIndex(index)
                      }}
                      className={cn(
                        "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                        lightboxIndex === index
                          ? "border-white scale-110"
                          : "border-white/30 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={plan.image}
                        alt={plan.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="absolute top-4 left-4 text-white/40 text-xs hidden md:block">
            Use arrow keys to navigate, ESC to close
          </div>
        </div>
      )}
    </section>
  )
}
