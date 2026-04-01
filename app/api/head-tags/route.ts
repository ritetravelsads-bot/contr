import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET active head tags (public route for frontend)
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const tags = await db
      .collection("head_tags")
      .find({ is_active: true })
      .sort({ created_at: 1 })
      .toArray()
    
    const serializedTags = tags.map(tag => ({
      _id: tag._id.toString(),
      tag_content: tag.tag_content,
      tag_type: tag.tag_type,
    }))
    
    return NextResponse.json(serializedTags)
  } catch (error) {
    console.error("Error fetching active head tags:", error)
    return NextResponse.json([])
  }
}
