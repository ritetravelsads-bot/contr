"use client"

import { Home, CheckCircle, XCircle, IndianRupee, Ruler, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Unit {
  type: string
  size_range?: string
  price_range?: string
  available?: boolean
}

interface Configuration {
  type: string
  super_area_min?: number
  super_area_max?: number
  base_price_range?: string
  availability?: "available" | "sold_out" | "enquire"
}

interface UnitsSectionProps {
  units?: Unit[]
  configurations?: Configuration[]
}

export function UnitsSection({ units, configurations }: UnitsSectionProps) {
  // Use units if available, otherwise convert configurations to units format
  const displayUnits: Unit[] = units && units.length > 0 
    ? units 
    : configurations?.map(c => ({
        type: c.type,
        size_range: c.super_area_min && c.super_area_max 
          ? `${c.super_area_min} - ${c.super_area_max} sqft` 
          : c.super_area_min 
            ? `${c.super_area_min} sqft` 
            : undefined,
        price_range: c.base_price_range,
        available: c.availability !== "sold_out"
      })) || []

  if (displayUnits.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Available Units</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Choose your perfect configuration</p>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayUnits.map((unit, index) => (
            <div
              key={index}
              className={cn(
                "group relative bg-card border-2 border-border rounded-2xl p-6 overflow-hidden",
                "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
                !unit.available && "opacity-75"
              )}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Header */}
              <div className="relative flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {unit.type}
                </h3>
                {unit.available !== undefined && (
                  <span className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full",
                    unit.available 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {unit.available ? (
                      <><CheckCircle className="h-3.5 w-3.5" /> Available</>
                    ) : (
                      <><XCircle className="h-3.5 w-3.5" /> Sold Out</>
                    )}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="relative space-y-4">
                {unit.size_range && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Size Range</p>
                      <p className="text-[15px] font-semibold text-foreground">{unit.size_range}</p>
                    </div>
                  </div>
                )}

                {unit.price_range && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Price Range</p>
                      <p className="text-lg font-bold text-primary">{unit.price_range}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              {unit.available && (
                <div className="relative mt-5 pt-5 border-t border-border">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
