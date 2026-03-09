"use client"

import { MapPin, IndianRupee, Calendar, Home, Building2 } from "lucide-react"
import { formatPriceToIndian } from "@/lib/utils"

interface HeroBannerProps {
  property: {
    property_name: string
    main_banner?: string
    main_thumbnail?: string
    address?: string
    city?: string
    state?: string
    lowest_price?: number
    max_price?: number
    possession?: string
    possession_date?: string
    configurations?: Array<{ type: string }>
    units?: Array<{ type: string }>
    payment_plan_details?: string
    payment_plan?: string
  }
}

export function HeroBanner({ property }: HeroBannerProps) {
  const bgImage = property.main_banner || property.main_thumbnail

  // Get unit types from configurations or units
  const unitTypes = property.configurations?.map(c => c.type).filter(Boolean) || 
                    property.units?.map(u => u.type).filter(Boolean) || []

  // Format payment plan
  const paymentPlan = property.payment_plan_details || 
    (property.payment_plan === "clp" ? "Construction Linked" : 
     property.payment_plan === "possession_linked" ? "Possession Linked" :
     property.payment_plan === "down_payment" ? "Down Payment" : 
     property.payment_plan)

  const formatPrice = (price: number) => formatPriceToIndian(price)

  const fullAddress = [property.address, property.city, property.state].filter(Boolean).join(", ")

  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {bgImage ? (
        <>
          <img
            src={bgImage}
            alt={property.property_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 text-center">
        {/* Property Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
          {property.property_name}
        </h1>

        {/* Address */}
        {fullAddress && (
          <p className="flex items-center justify-center gap-2 text-white/90 text-sm md:text-base mb-8">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{fullAddress}</span>
          </p>
        )}

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
          {/* Price */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
            <IndianRupee className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-white/70 mb-1">Price</p>
            <p className="font-bold text-sm md:text-base">
              {property.lowest_price ? (
                <>
                  {formatPrice(property.lowest_price)}
                  {property.max_price && property.max_price !== property.lowest_price && (
                    <span className="text-xs text-white/70"> - {formatPrice(property.max_price)}</span>
                  )}
                </>
              ) : (
                "On Request"
              )}
            </p>
          </div>

          {/* Possession */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-white/70 mb-1">Possession</p>
            <p className="font-bold text-sm md:text-base">
              {property.possession || property.possession_date || "Contact Us"}
            </p>
          </div>

          {/* Unit Types */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
            <Home className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-white/70 mb-1">Unit Types</p>
            <p className="font-bold text-sm md:text-base">
              {unitTypes.length > 0 ? unitTypes.slice(0, 3).join(", ") : "Multiple Options"}
            </p>
          </div>

          {/* Payment Plan */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
            <Building2 className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-white/70 mb-1">Payment Plan</p>
            <p className="font-bold text-sm md:text-base">
              {paymentPlan || "Flexible Plans"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
