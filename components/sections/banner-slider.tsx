"use client"

import { useState, useEffect, useCallback } from "react"
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

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (isPaused) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isPaused, nextSlide])

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 aspect-[3/4] md:aspect-[10/3]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          )}
        >
          {/* Background Image - Different for mobile/desktop */}
          <div className="absolute inset-0">
            {/* Desktop Image */}
            <Image 
              src={slide.image || "/placeholder.svg"} 
              alt={slide.title || "Banner"} 
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              quality={85}
              className={cn(
                "object-contain hidden md:block",
                index !== currentSlide && "opacity-0"
              )}
            />
            {/* Mobile Image */}
            <Image 
              src={slide.mobileImage || slide.image || "/placeholder.svg"} 
              alt={slide.title || "Banner"} 
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              quality={80}
              className={cn(
                "object-cover md:hidden",
                index !== currentSlide && "opacity-0"
              )}
            />
          </div>
          
          {/* Gradient Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#002366]/90 via-[#002366]/70 to-transparent" /> */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" /> */}
          
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
