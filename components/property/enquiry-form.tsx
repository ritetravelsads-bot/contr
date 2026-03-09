"use client"

import { useState } from "react"
import { Send, Phone, User, Mail, MessageSquare, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnquiryFormProps {
  propertyId?: string
  propertyName?: string
  propertySlug?: string
}

export function EnquiryForm({ propertyId, propertyName, propertySlug }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/property-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId,
          property_name: propertyName,
          property_slug: propertySlug
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: "", phone: "", email: "", message: "" })
      } else {
        setError(data.error || "Failed to submit enquiry")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="py-8 md:py-12 bg-primary/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your enquiry has been submitted successfully. Our team will contact you shortly.
            </p>
            <Button onClick={() => setSuccess(false)} variant="outline">
              Submit Another Enquiry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-primary/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Enquire Now
            </h2>
            <p className="text-muted-foreground">
              Interested in this property? Fill out the form and our team will get back to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                  pattern="[6-9][0-9]{9}"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email (optional)"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your requirements (optional)"
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Enquiry
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
              {" "}and{" "}
              <a href="/terms-and-conditions" className="text-primary hover:underline">Terms of Service</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
