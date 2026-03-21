import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import BlogPostForm from "@/components/admin/blog-post-form"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Create Blog Post | CountryRoof Admin",
  robots: { index: false },
}

export default async function NewBlogPostPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Blog Post"
        description="Write and publish a new blog post"
        showBackButton
        backHref="/admin/blog"
      />
      <BlogPostForm />
    </div>
  )
}
