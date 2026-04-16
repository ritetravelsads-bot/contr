"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
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
  const [mounted, setMounted] = useState(false)

  // For portal - ensure we only render on client
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Lightbox component rendered via portal
  const lightboxContent = showLightbox && mounted ? (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.97)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={closeLightbox}
    >
      {/* Top Controls Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image info */}
        <div>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: 0 }}>
            {plans[lightboxIndex].label}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: '4px 0 0 0' }}>
            {lightboxIndex + 1} of {plans.length}
          </p>
        </div>

        {/* Center: Zoom Controls */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '6px',
          }}
        >
          <button
            onClick={zoomOut}
            disabled={zoomLevel <= 0.5}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: zoomLevel <= 0.5 ? 'not-allowed' : 'pointer',
              opacity: zoomLevel <= 0.5 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Zoom out (-)"
          >
            <ZoomOut style={{ width: '22px', height: '22px' }} />
          </button>
          <span 
            style={{
              padding: '8px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              minWidth: '70px',
              textAlign: 'center',
            }}
          >
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoomLevel >= 3}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: zoomLevel >= 3 ? 'not-allowed' : 'pointer',
              opacity: zoomLevel >= 3 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Zoom in (+)"
          >
            <ZoomIn style={{ width: '22px', height: '22px' }} />
          </button>
          <button
            onClick={resetZoom}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Reset zoom (0)"
          >
            <RotateCcw style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Right: Close button */}
        <button
          onClick={closeLightbox}
          style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close lightbox"
        >
          <X style={{ width: '26px', height: '26px' }} />
        </button>
      </div>

      {/* Main Image Area */}
      <div 
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation - Previous */}
        {plans.length > 1 && (
          <button
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            aria-label="Previous image"
          >
            <ChevronLeft style={{ width: '28px', height: '28px' }} />
          </button>
        )}

        {/* Image Container with zoom */}
        <div 
          style={{ 
            position: 'relative',
            transition: 'transform 0.2s ease-out',
            transform: `scale(${zoomLevel})`,
            width: '75vw',
            height: '65vh',
            maxWidth: '1100px',
          }}
        >
          <Image
            src={plans[lightboxIndex].image}
            alt={`Floor Plan - ${plans[lightboxIndex].label}`}
            fill
            style={{ objectFit: 'contain' }}
            sizes="85vw"
            priority
          />
        </div>

        {/* Navigation - Next */}
        {plans.length > 1 && (
          <button
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            aria-label="Next image"
          >
            <ChevronRight style={{ width: '28px', height: '28px' }} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {plans.length > 1 && (
        <div 
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '16px 20px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              overflowX: 'auto',
            }}
          >
            {plans.map((plan, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(index)
                  setZoomLevel(1)
                }}
                style={{
                  position: 'relative',
                  width: '70px',
                  height: '50px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: lightboxIndex === index 
                    ? '3px solid white' 
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  opacity: lightboxIndex === index ? 1 : 0.6,
                  cursor: 'pointer',
                  flexShrink: 0,
                  padding: 0,
                  background: 'transparent',
                }}
              >
                <Image
                  src={plan.image}
                  alt={plan.label}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="70px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div 
        style={{
          position: 'absolute',
          bottom: plans.length > 1 ? '90px' : '20px',
          left: '20px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
        }}
      >
        Arrow keys: navigate | +/-: zoom | 0: reset | ESC: close
      </div>
    </div>
  ) : null

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

      {/* Render lightbox via portal to document.body */}
      {mounted && showLightbox && createPortal(lightboxContent, document.body)}
    </section>
  )
}
