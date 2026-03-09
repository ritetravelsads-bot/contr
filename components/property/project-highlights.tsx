"use client"

import { Check, Sparkles } from "lucide-react"

interface ProjectHighlightsProps {
  highlights: string[]
}

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  if (!highlights || highlights.length === 0) return null

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Project Highlights</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
