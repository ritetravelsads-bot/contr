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

    // Find location by slug from database
    const dbLocation = await db.collection("locations").findOne({ slug })

    // If location doesn't exist in DB, create a virtual location from the slug
    // This allows location pages to work even if not all locations are in the database
    const location = dbLocation || {
      _id: slug,
      name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug: slug,
      type: 'locality',
      city: 'Gurgaon',
      state: 'Haryana',
    }

    // Build property query based on location
    const propertyQuery: Record<string, any> = {}
    
    // Build search terms from location name (e.g., "golf-course-road" -> ["golf course road", "golf-course-road"])
    const locationName = location.name
    const locationSlug = location.slug || slug
    
    // Create variations of the search term for better matching
    const searchTerms = [
      locationName,
      locationSlug,
      locationSlug.replace(/-/g, " "),  // "golf-course-road" -> "golf course road"
      locationSlug.replace(/-/g, ""),   // "golf-course-road" -> "golfcourseroad"
      // Also try individual words for partial matching
      ...locationName.split(/[\s-]+/).filter(word => word.length > 2),
    ].filter(Boolean)
    
    // Remove duplicates
    const uniqueTerms = [...new Set(searchTerms.map(t => t.toLowerCase()))]
    
    // Match properties by searching in multiple location-related fields
    const searchConditions: any[] = []
    
    for (const term of uniqueTerms) {
      const pattern = { $regex: term, $options: "i" }
      // Search in address field
      searchConditions.push({ address: pattern })
      // Search in neighborhood/locality field
      searchConditions.push({ neighborhood: pattern })
      // Search in location field if it exists
      searchConditions.push({ location: pattern })
      // Search in locality field if it exists
      searchConditions.push({ locality: pattern })
    }

    // If location has specific city/state, add those to search conditions
    if (location.city) {
      searchConditions.push({ city: { $regex: location.city, $options: "i" } })
    }
    if (location.state) {
      searchConditions.push({ state: { $regex: location.state, $options: "i" } })
    }
    
    // Build the final query with $and to combine status filter with location search
    const andConditions: any[] = []
    
    // Status filter - active or available (same as main properties API)
    andConditions.push({
      $or: [{ status: "active" }, { status: "available" }, { status: { $exists: false } }]
    })
    
    // Add location search conditions
    if (searchConditions.length > 0) {
      andConditions.push({ $or: searchConditions })
    }
    
    propertyQuery.$and = andConditions

    // Get total count
    const totalProperties = await db.collection("properties").countDocuments(propertyQuery)
    const totalPages = Math.ceil(totalProperties / limit)

    // Get paginated properties
    const properties = await db
      .collection("properties")
      .find(propertyQuery)
      .sort({ is_featured: -1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Serialize - handle both database locations (with ObjectId) and virtual locations
    const serializedLocation = {
      ...location,
      _id: typeof location._id === 'object' ? location._id.toString() : location._id,
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
