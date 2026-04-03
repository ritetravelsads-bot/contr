import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(req.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit
    
    const db = await getDatabase()

    // Find location by slug
    const location = await db.collection("locations").findOne({ slug })

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Build property query based on location
    const propertyQuery: Record<string, any> = { status: "active" }
    
    // Build search terms from location name (e.g., "new-gurgaon" -> ["new", "gurgaon", "new-gurgaon", "new gurgaon"])
    const locationName = location.name
    const locationSlug = location.slug || slug
    const searchTerms = [
      locationName,
      locationSlug,
      locationSlug.replace(/-/g, " "), // Convert slug to space-separated
      locationSlug.replace(/-/g, ""), // Remove hyphens entirely
    ].filter(Boolean)
    
    // Create regex patterns for all search terms
    const searchPatterns = searchTerms.map(term => ({ $regex: term, $options: "i" }))
    
    // Match properties by searching in address and neighborhood (locality) fields
    const searchConditions: any[] = []
    
    for (const pattern of searchPatterns) {
      // Search in address field
      searchConditions.push({ address: pattern })
      // Search in neighborhood/locality field
      searchConditions.push({ neighborhood: pattern })
      // Also search in city for broader matches
      searchConditions.push({ city: pattern })
    }

    // If location has specific city/state, add those to search conditions
    if (location.city) {
      searchConditions.push({ city: { $regex: location.city, $options: "i" } })
    }
    if (location.state) {
      searchConditions.push({ state: { $regex: location.state, $options: "i" } })
    }
    
    propertyQuery.$or = searchConditions

    // Get total count
    const totalProperties = await db.collection("properties").countDocuments(propertyQuery)
    const totalPages = Math.ceil(totalProperties / limit)

    // Get paginated properties
    const properties = await db
      .collection("properties")
      .find(propertyQuery)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Serialize
    const serializedLocation = {
      ...location,
      _id: location._id.toString(),
    }

    const serializedProperties = properties.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json({
      location: serializedLocation,
      properties: serializedProperties,
      pagination: {
        page,
        limit,
        total: totalProperties,
        totalPages,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching location:", error)
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 })
  }
}
