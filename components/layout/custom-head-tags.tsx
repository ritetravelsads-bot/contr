import { connectDB } from "@/lib/mongodb"

interface HeadTag {
  _id: string
  tag_content: string
  tag_type: string
}

async function getActiveHeadTags(): Promise<HeadTag[]> {
  try {
    const db = await connectDB()
    
    const tags = await db
      .collection("head_tags")
      .find({ is_active: true })
      .sort({ created_at: 1 })
      .toArray()
    
    return tags.map(tag => ({
      _id: tag._id.toString(),
      tag_content: tag.tag_content,
      tag_type: tag.tag_type,
    }))
  } catch (error) {
    console.error("Error fetching head tags:", error)
    return []
  }
}

// Function to check if a tag contains robots noindex/nofollow that should be blocked
function shouldBlockTag(tagContent: string): boolean {
  const lower = tagContent.toLowerCase()
  
  // Block any meta tag with robots name attribute that contains noindex or nofollow
  if (lower.includes('name="robots"') || lower.includes("name='robots'")) {
    if (lower.includes('noindex') || lower.includes('nofollow')) {
      console.log("[v0] Blocking robots meta tag:", tagContent)
      return true
    }
  }
  
  // Also block meta robots tags with property attribute (edge case)
  if (lower.includes('property="robots"') || lower.includes("property='robots'")) {
    if (lower.includes('noindex') || lower.includes('nofollow')) {
      console.log("[v0] Blocking robots meta property tag:", tagContent)
      return true
    }
  }
  
  return false
}

export default async function CustomHeadTags() {
  const tags = await getActiveHeadTags()
  
  // Filter out any robots meta tags that contain noindex or nofollow
  const filteredTags = tags.filter((tag) => !shouldBlockTag(tag.tag_content))
  
  if (filteredTags.length === 0) return null
  
  return (
    <>
      {filteredTags.map((tag) => (
        <div
          key={tag._id}
          dangerouslySetInnerHTML={{ __html: tag.tag_content }}
        />
      ))}
    </>
  )
}
