"use client"

import { useState, useEffect, useCallback, memo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    image: "/home-banner-1.jpg",
    mobileImage: "/banners/home-mob-banner-1.jpg",
    title: "",
    subtitle: "",
    tag: "",
  },
  {
    id: 2,
    image: "/home-banner-2.jpg",
    mobileImage: "/banners/home-mob-banner-2.jpg",
    title: "",
    subtitle: "",
    tag: "",
  },
  {
    id: 3,
    image: "/home-banner-3.jpg",
    mobileImage: "/banners/home-mob-banner-3.jpg",
    title: "",
    subtitle: "",
    tag: "",
  },
  {
    id: 4,
    image: "/home-banner-4.jpg",
    mobileImage: "/banners/home-mob-banner-4.jpg",
    title: "",
    subtitle: "",
    tag: "",
  },
]

// Static first slide rendered immediately without JS - critical for LCP
function FirstSlideStatic() {
  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <Image 
          src="/home-banner-1.jpg"
          alt="Banner"
          fill
          priority
          loading="eager"
          sizes="(max-width: 767px) 1px, 100vw"
          quality={85}
          fetchPriority="high"
          decoding="sync"
          className="object-contain hidden md:block"
        />
        {/* Mobile Image - LCP element */}
        <Image 
          src="/banners/home-mob-banner-1.jpg"
          alt="Banner"
          fill
          priority
          loading="eager"
          sizes="(min-width: 768px) 1px, 100vw"
          quality={80}
          fetchPriority="high"
          decoding="sync"
          className="object-cover md:hidden"
        />
      </div>
    </div>
  )
}

// Memoized slide component for subsequent slides
const SlideImage = memo(function SlideImage({ 
  slide, 
  index, 
  isActive 
}: { 
  slide: typeof slides[0]
  index: number
  isActive: boolean 
}) {
  // Skip first slide as it's rendered statically
  if (index === 0) return null
  
  // Only render active slide and next slide for smooth transitions
  const shouldRender = isActive || index === 1

  if (!shouldRender) return null

  return (
    <>
      {/* Desktop Image */}
      <Image 
        src={slide.image || "/placeholder.svg"} 
        alt={slide.title || "Banner"} 
        fill
        loading="lazy"
        sizes="(max-width: 767px) 1px, 100vw"
        quality={75}
        fetchPriority="low"
        decoding="async"
        className={cn(
          "object-contain hidden md:block",
          !isActive && "opacity-0"
        )}
      />
      {/* Mobile Image */}
      <Image 
        src={slide.mobileImage || slide.image || "/placeholder.svg"} 
        alt={slide.title || "Banner"} 
        fill
        loading="lazy"
        sizes="(min-width: 768px) 1px, 100vw"
        quality={70}
        fetchPriority="low"
        decoding="async"
        className={cn(
          "object-cover md:hidden",
          !isActive && "opacity-0"
        )}
      />
    </>
  )
})

function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isHydrated, nextSlide])

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-100 aspect-[3/4] md:aspect-[10/3]"
    >
      {/* Static first slide - always visible initially for instant LCP */}
      <FirstSlideStatic />
      
      {/* Dynamic slides - only rendered after hydration */}
      {isHydrated && slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            index === currentSlide 
              ? "opacity-100 z-10" 
              : "opacity-0 z-0"
          )}
        >
          <div className="absolute inset-0">
            <SlideImage 
              slide={slide} 
              index={index} 
              isActive={index === currentSlide} 
            />
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
              <div className="max-w-2xl space-y-6">
                {/* Title */}
                <h1 
                  className={cn(
                    "text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight",
                    "transition-all duration-700 delay-200",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}
                >
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                <p 
                  className={cn(
                    "text-lg md:text-xl lg:text-2xl text-white/90 max-w-xl",
                    "transition-all duration-700 delay-300",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(BannerSlider)
