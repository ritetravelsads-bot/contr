import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { getBlogPostById } from "@/app/blog/_actions"
import BlogPostForm from "@/components/admin/blog-post-form"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Edit Blog Post | CountryRoof Admin",
  robots: { index: false },
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const { id } = await params
  const blogPost = await getBlogPostById(id)

  if (!blogPost) {
    redirect("/admin/blog")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Blog Post"
        description={`Editing: ${blogPost.title || "Blog Post"}`}
        showBackButton
        backHref="/admin/blog"
      />
      <BlogPostForm initialData={blogPost} />
    </div>
  )
}
