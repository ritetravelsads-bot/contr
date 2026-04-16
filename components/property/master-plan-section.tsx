"use client"

import { useState, useEffect, useCallback } from "react"
import { Map, ZoomIn, X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MasterPlanSectionProps {
  masterPlan?: string
  propertyName?: string
}

export function MasterPlanSection({ masterPlan, propertyName }: MasterPlanSectionProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showLightbox) return
    if (e.key === "Escape") {
      setShowLightbox(false)
    }
  }, [showLightbox])

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

  if (!masterPlan) return null

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 tracking-wide">
            <Map className="h-3 w-3" />
            MASTER PLAN
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Project Master Plan</h2>
          <p className="text-muted-foreground text-xs mt-1">
            Complete layout overview of {propertyName || "the project"}
          </p>
        </div>

        {/* Master Plan Image Container with max height */}
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg" style={{ maxHeight: "550px" }}>
          {/* Image Container */}
          <div 
            className="relative bg-muted/50 cursor-zoom-in group"
            style={{ height: "450px" }}
            onClick={() => setShowLightbox(true)}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={masterPlan}
              alt={`Master Plan - ${propertyName || "Project"}`}
              className={cn(
                "w-full h-full object-contain p-4 transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLightbox(true)
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

            {/* Corner label */}
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-blue-500/90 rounded-lg text-white text-xs font-semibold">
              Master Layout
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Project Master Plan</p>
              <p className="text-xs text-muted-foreground">
                Overall project layout and amenities placement
              </p>
            </div>
            <button
              onClick={() => setShowLightbox(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              View Full Size
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
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

          {/* Main Image */}
          <div 
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={masterPlan}
              alt={`Master Plan - ${propertyName || "Project"}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-6 px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Master Plan</p>
                <p className="text-white/60 text-sm">
                  {propertyName || "Project"} - Complete Layout
                </p>
              </div>
              <a
                href={masterPlan}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
                Open Full Size
              </a>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="absolute top-4 left-4 text-white/40 text-xs hidden md:block">
            Press ESC to close
          </div>
        </div>
      )}
    </section>
  )
}
