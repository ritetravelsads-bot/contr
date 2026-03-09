"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, MapPin, ArrowRight } from "lucide-react"
import { formatPriceToIndian } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Project {
  _id: string
  property_name: string
  slug: string
  main_thumbnail?: string
  city?: string
  state?: string
  lowest_price?: number
  max_price?: number
  property_type?: string
  possession?: string
}

interface Developer {
  _id: string
  name: string
  slug: string
  logo_url?: string
  description?: string
  website?: string
  project_count?: number
}

interface DeveloperProjectsProps {
  developerId?: string
  developerSlug?: string
  developerName?: string
  excludePropertyId?: string
}

export function DeveloperProjects({ 
  developerId, 
  developerSlug, 
  developerName,
  excludePropertyId 
}: DeveloperProjectsProps) {
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDeveloperProjects = async () => {
      if (!developerId && !developerSlug) {
        setLoading(false)
        return
      }

      try {
        const slug = developerSlug || developerId
        const excludeParam = excludePropertyId ? `&exclude=${excludePropertyId}` : ""
        const res = await fetch(`/api/developers/${slug}/projects?limit=4${excludeParam}`)
        
        if (res.ok) {
          const data = await res.json()
          setDeveloper(data.developer)
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error("Error loading developer projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDeveloperProjects()
  }, [developerId, developerSlug, excludePropertyId])

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 bg-muted rounded w-64 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-muted rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!developer && !developerName) return null

  const displayName = developer?.name || developerName

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Developer Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {developer?.logo_url ? (
              <img
                src={developer.logo_url}
                alt={displayName}
                className="w-16 h-16 rounded-xl object-contain bg-card border border-border p-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">About {displayName}</h2>
              {developer?.project_count && (
                <p className="text-sm text-muted-foreground">
                  {developer.project_count} Projects
                </p>
              )}
            </div>
          </div>

          {developer?.slug && (
            <Button asChild variant="outline">
              <Link href={`/developers/${developer.slug}`}>
                View All Projects
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>

        {/* Developer Description */}
        {developer?.description && (
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-3xl">
            {developer.description}
          </p>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              More Projects by {displayName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map(project => (
                <Link
                  key={project._id}
                  href={`/properties/${project.slug || project._id}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {project.main_thumbnail ? (
                      <img
                        src={project.main_thumbnail}
                        alt={project.property_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.property_name}
                    </h4>

                    {(project.city || project.state) && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3" />
                        {[project.city, project.state].filter(Boolean).join(", ")}
                      </p>
                    )}

                    {project.lowest_price && (
                      <p className="text-sm font-bold text-primary">
                        {formatPriceToIndian(project.lowest_price)}
                        {project.max_price && project.max_price !== project.lowest_price && (
                          <span className="text-xs text-muted-foreground font-normal">
                            {" "}- {formatPriceToIndian(project.max_price)}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
