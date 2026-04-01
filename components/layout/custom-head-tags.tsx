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
  
  if (tags.length === 0) return null
  
  return (
    <>
      {tags.map((tag) => (
        <div
          key={tag._id}
          dangerouslySetInnerHTML={{ __html: tag.tag_content }}
        />
      ))}
    </>
  )
}
