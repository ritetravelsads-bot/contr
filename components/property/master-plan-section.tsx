"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { Map, ZoomIn, ZoomOut, X, Maximize2, RotateCcw } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MasterPlanSectionProps {
  masterPlan?: string
  propertyName?: string
}

export function MasterPlanSection({ masterPlan, propertyName }: MasterPlanSectionProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mounted, setMounted] = useState(false)

  // For portal - ensure we only render on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showLightbox) return
    if (e.key === "Escape") {
      setShowLightbox(false)
      setZoomLevel(1)
    } else if (e.key === "+" || e.key === "=") {
      setZoomLevel(prev => Math.min(prev + 0.25, 3))
    } else if (e.key === "-") {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
    } else if (e.key === "0") {
      setZoomLevel(1)
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

  const openLightbox = () => {
    setZoomLevel(1)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setZoomLevel(1)
  }

  const zoomInHandler = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const zoomOutHandler = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(1)
  }

  if (!masterPlan) return null

  // Lightbox component rendered via portal - Mobile optimized
  const lightboxContent = showLightbox && mounted ? (
    <div 
      className="fixed inset-0 w-screen h-screen bg-black/98 flex flex-col"
      style={{ zIndex: 99999 }}
      onClick={closeLightbox}
    >
      {/* Top Bar - Responsive */}
      <div 
        className="flex items-center justify-between px-3 py-2 md:px-5 md:py-3 bg-black/80 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image info */}
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm md:text-base truncate">
            Master Plan
          </p>
          <p className="text-white/60 text-xs md:text-sm hidden sm:block">
            {propertyName || "Project"} - Complete Layout
          </p>
        </div>

        {/* Center: Zoom Controls - Compact on mobile */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={zoomOutHandler}
            disabled={zoomLevel <= 0.5}
            className="p-2 md:p-2.5 rounded-md text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <span className="px-2 md:px-3 text-white text-xs md:text-sm font-semibold min-w-[50px] md:min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomInHandler}
            disabled={zoomLevel >= 3}
            className="p-2 md:p-2.5 rounded-md text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 md:p-2.5 rounded-md text-white hover:bg-white/10 transition-colors"
            title="Reset zoom"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Right: Close button */}
        <button
          onClick={closeLightbox}
          className="p-2 md:p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Main Image Area */}
      <div 
        className="flex-1 relative overflow-auto flex items-center justify-center p-2 md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container with zoom */}
        <div 
          className="relative transition-transform duration-200 ease-out w-full h-full max-w-[95vw] md:max-w-[80vw] max-h-[75vh] md:max-h-[80vh]"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <Image
            src={masterPlan}
            alt={`Master Plan - ${propertyName || "Project"}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 95vw, 80vw"
            priority
          />
        </div>
      </div>

      {/* Bottom Info Bar - Mobile Friendly */}
      <div 
        className="bg-black/80 border-t border-white/10 px-3 py-2 md:px-5 md:py-3 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-white text-xs md:text-sm font-medium truncate">
              {propertyName || "Project"} Master Plan
            </p>
            <p className="text-white/50 text-[10px] md:text-xs hidden sm:block">
              Pinch to zoom on touch devices
            </p>
          </div>
          <a
            href={masterPlan}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-medium transition-colors shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Open Full Size</span>
            <span className="sm:hidden">Full</span>
          </a>
        </div>
      </div>
    </div>
  ) : null

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
            className="relative bg-muted/50 cursor-zoom-in group h-[300px] md:h-[450px]"
            onClick={openLightbox}
          >
            <Image
              src={masterPlan}
              alt={`Master Plan - ${propertyName || "Project"}`}
              fill
              className="object-contain p-3 md:p-4"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            
            {/* Action buttons - always visible on mobile */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox()
                }}
                className="p-2 md:p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-lg text-white transition-colors"
                title="View fullscreen"
              >
                <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            {/* Corner label */}
            <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-1 md:px-3 md:py-1.5 bg-blue-500/90 rounded-lg text-white text-[10px] md:text-xs font-semibold">
              Master Layout
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 md:px-4 py-2 md:py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-semibold text-foreground">Project Master Plan</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Overall project layout and amenities
              </p>
            </div>
            <button
              onClick={openLightbox}
              className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-medium transition-colors"
            >
              <ZoomIn className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span className="hidden sm:inline">View Full Size</span>
              <span className="sm:hidden">View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render lightbox via portal to document.body */}
      {mounted && showLightbox && createPortal(lightboxContent, document.body)}
    </section>
  )
}
