"use client"

import { Check, Sparkles, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectHighlightsProps {
  highlights: string[]
}

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  if (!highlights || highlights.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Project Highlights</h2>
            <p className="text-muted-foreground text-sm mt-0.5">What makes this property special</p>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className={cn(
                "group relative flex items-start gap-4 p-5 bg-card border border-border rounded-2xl",
                "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
                "hover:-translate-y-0.5"
              )}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="relative flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                <Check className="h-4 w-4 text-primary" />
              </div>
              
              {/* Text */}
              <p className="relative text-[15px] text-foreground leading-relaxed font-medium pt-1">
                {highlight}
              </p>

              {/* Star badge for first 3 highlights */}
              {index < 3 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="h-3 w-3 text-white fill-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
