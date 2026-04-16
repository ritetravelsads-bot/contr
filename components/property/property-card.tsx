import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPriceRange } from "@/lib/utils"
import { PropertyWhatsAppLink } from "@/components/ui/whatsapp-button"

// Property type slug mapping for URL structure
const PROPERTY_TYPE_MAP: Record<string, string[]> = {
  residential: ["apartment", "villa", "house", "flat", "penthouse", "duplex", "studio", "independent", "row house", "bungalow", "farmhouse"],
  commercial: ["office", "shop", "commercial", "showroom", "warehouse", "retail", "sco", "scf", "multiplex"],
  plots: ["plot", "land", "agricultural", "industrial land"],
}

function getPropertyTypeSlug(propertyType: string): string {
  if (!propertyType) return "residential"
  const lowerType = propertyType.toLowerCase()
  
  for (const [slug, types] of Object.entries(PROPERTY_TYPE_MAP)) {
    if (types.some(t => lowerType.includes(t))) {
      return slug
    }
  }
  return "residential"
}

interface PropertyCardProps {
  property: {
    _id: string
    slug?: string
    property_name: string
    property_type?: string
    main_thumbnail: string
    lowest_price: number
    max_price?: number
    price_range?: string
    bedrooms: number
    bathrooms: number
    area_sqft: number
    address: string
    city: string
    state: string
    is_featured?: boolean
    is_hot?: boolean
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.main_thumbnail || "/placeholder.jpg"
  
  // Use price_range if available, otherwise format from lowest/max price
  const priceDisplay = property.price_range || formatPriceRange(property.lowest_price, property.max_price)
  const typeSlug = getPropertyTypeSlug(property.property_type || "")
  
  return (
    <Link href={`/properties/${typeSlug}/${property.slug || property._id}`} className="block min-h-[200px]">
      <div className="bento-card hover:shadow-lg cursor-pointer group h-full">
        {/* Image with badges - fixed dimensions to prevent CLS */}
        <div className="relative mb-2.5 overflow-hidden rounded bg-muted aspect-[4/3] min-h-[120px] hover:shadow-md transition-shadow">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={property.property_name || "Property"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={75}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            {property.is_featured && <Badge className="text-xs bg-primary">Featured</Badge>}
            {property.is_hot && (
              <Badge variant="destructive" className="text-xs">
                Hot
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 right-2 transition-opacity duration-200">
            <PropertyWhatsAppLink propertyName={property.property_name} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">
            {property.property_name || "Property"}
          </h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            <span className="line-clamp-1">
              {property.address || "Location"}, {property.city || ""}
            </span>
          </div>

          {/* Specs - High-density micro-format */}
          <div className="flex gap-2 text-xs text-muted-foreground border-t border-border/30 pt-1.5">
            <div className="flex items-center gap-0.5 optical-divider">
              <Bed size={12} />
              <span>{property.bedrooms || 0}</span>
            </div>
            <div className="flex items-center gap-0.5 optical-divider">
              <Bath size={12} />
              <span>{property.bathrooms || 0}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Maximize2 size={12} />
              <span>{property.area_sqft || 0}</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-1.5 border-t border-border/30">
            <p className="font-bold text-sm text-primary">
              {priceDisplay}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
