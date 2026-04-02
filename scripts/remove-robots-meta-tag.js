import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set')
  process.exit(1)
}

async function removeRobotsMeta() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()
    
    console.log('Connected to MongoDB')
    console.log('Searching for robots meta tags...')
    
    // Find all tags containing robots noindex/nofollow
    const tagsToRemove = await db.collection('head_tags').find({
      tag_content: { $regex: 'robots.*noindex|robots.*nofollow', $options: 'i' }
    }).toArray()

    if (tagsToRemove.length === 0) {
      console.log('✓ No robots meta tags found to remove')
    } else {
      console.log(`Found ${tagsToRemove.length} robots meta tag(s):`)
      tagsToRemove.forEach(tag => {
        console.log(`  - ${tag.tag_content}`)
      })

      // Delete the tags
      const result = await db.collection('head_tags').deleteMany({
        tag_content: { $regex: 'robots.*noindex|robots.*nofollow', $options: 'i' }
      })

      console.log(`\n✓ Successfully deleted ${result.deletedCount} robots meta tag(s)`)
    }

    await client.close()
    console.log('✓ Database connection closed')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

removeRobotsMeta()
