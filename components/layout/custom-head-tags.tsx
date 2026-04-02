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

export default async function CustomHeadTags() {
  const tags = await getActiveHeadTags()
  
  // Filter out robots meta tags that contain noindex or nofollow
  const filteredTags = tags.filter((tag) => {
    const isRobotsMeta = tag.tag_content.includes('name="robots"') && 
                         (tag.tag_content.includes('noindex') || tag.tag_content.includes('nofollow'))
    return !isRobotsMeta
  })
  
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
