"use client"

import { 
  MapPin, Train, Plane, Car, Hospital, 
  GraduationCap, ShoppingBag, Bus, ExternalLink 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const TYPE_ICONS: Record<string, any> = {
  metro: Train,
  airport: Plane,
  highway: Car,
  hospital: Hospital,
  school: GraduationCap,
  mall: ShoppingBag,
  railway: Train,
  bus_stand: Bus,
}

const TYPE_LABELS: Record<string, string> = {
  metro: "Metro Station",
  airport: "Airport",
  highway: "Highway",
  hospital: "Hospital",
  school: "School",
  mall: "Mall",
  railway: "Railway Station",
  bus_stand: "Bus Stand",
}

interface ConnectivityItem {
  type: "metro" | "airport" | "highway" | "hospital" | "school" | "mall" | "railway" | "bus_stand"
  name: string
  distance: string
}

interface NearbyItem {
  category: string
  name: string
  distance: string
}

interface LocationConnectivityProps {
  connectivity?: ConnectivityItem[]
  nearby?: NearbyItem[]
  googleMapLink?: string
  address?: string
  city?: string
  state?: string
}

export function LocationConnectivity({ 
  connectivity, 
  nearby, 
  googleMapLink,
  address,
  city,
  state 
}: LocationConnectivityProps) {
  // Combine connectivity and nearby into a single list
  const allLocations: ConnectivityItem[] = [
    ...(connectivity || []),
    ...(nearby?.map(n => ({
      type: n.category as ConnectivityItem["type"],
      name: n.name,
      distance: n.distance
    })) || [])
  ]

  if (allLocations.length === 0 && !googleMapLink) return null

  const fullAddress = [address, city, state].filter(Boolean).join(", ")

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Location & Connectivity</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connectivity List */}
          <div className="space-y-3">
            {allLocations.map((item, index) => {
              const Icon = TYPE_ICONS[item.type] || MapPin
              const label = TYPE_LABELS[item.type] || item.type

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {item.distance}
                    </span>
                  </div>
                </div>
              )
            })}

            {allLocations.length === 0 && fullAddress && (
              <div className="p-4 bg-card border border-border rounded-xl">
                <p className="text-sm text-foreground">{fullAddress}</p>
              </div>
            )}
          </div>

          {/* Map or CTA */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {googleMapLink ? (
              <div className="h-full min-h-[300px] flex flex-col">
                <iframe
                  src={googleMapLink.replace("/maps/", "/maps/embed?pb=")}
                  className="flex-grow w-full"
                  style={{ minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="p-4 border-t border-border">
                  <Button asChild variant="outline" className="w-full">
                    <a href={googleMapLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">Map view not available</p>
                {fullAddress && (
                  <p className="text-sm text-foreground">{fullAddress}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
