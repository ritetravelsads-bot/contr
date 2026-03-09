"use client"

import { Home, CheckCircle, XCircle } from "lucide-react"

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
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Home className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Available Units</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayUnits.map((unit, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-foreground">{unit.type}</h3>
                {unit.available !== undefined && (
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    unit.available ? "text-emerald-600" : "text-muted-foreground"
                  }`}>
                    {unit.available ? (
                      <><CheckCircle className="h-3.5 w-3.5" /> Available</>
                    ) : (
                      <><XCircle className="h-3.5 w-3.5" /> Sold Out</>
                    )}
                  </span>
                )}
              </div>

              {unit.size_range && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="text-sm font-medium text-foreground">{unit.size_range}</p>
                </div>
              )}

              {unit.price_range && (
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-sm font-bold text-primary">{unit.price_range}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
