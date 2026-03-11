"use client"

import { useState } from "react"
import { Send, Phone, User, Mail, MessageSquare, Loader2, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Thank You!</h2>
            <p className="text-muted-foreground text-[15px] mb-8 leading-relaxed">
              Your enquiry has been submitted successfully. Our expert team will contact you within 24 hours.
            </p>
            <Button onClick={() => setSuccess(false)} variant="outline" size="lg" className="rounded-xl">
              Submit Another Enquiry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-primary/10 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Get Expert Advice
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Enquire Now
            </h2>
            <p className="text-muted-foreground text-[15px]">
              Interested in this property? Fill out the form and our team will get back to you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-xl shadow-black/5">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-2">
                <span className="w-2 h-2 bg-destructive rounded-full" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className={cn(
                "relative rounded-xl transition-all duration-300",
                focusedField === "name" && "ring-2 ring-primary/20"
              )}>
                <User className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                  focusedField === "name" ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className={cn(
                "relative rounded-xl transition-all duration-300",
                focusedField === "phone" && "ring-2 ring-primary/20"
              )}>
                <Phone className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                  focusedField === "phone" ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  required
                  pattern="[6-9][0-9]{9}"
                  className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Email Address
              </label>
              <div className={cn(
                "relative rounded-xl transition-all duration-300",
                focusedField === "email" && "ring-2 ring-primary/20"
              )}>
                <Mail className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                  focusedField === "email" ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email (optional)"
                  className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Message
              </label>
              <div className={cn(
                "relative rounded-xl transition-all duration-300",
                focusedField === "message" && "ring-2 ring-primary/20"
              )}>
                <MessageSquare className={cn(
                  "absolute left-4 top-4 h-5 w-5 transition-colors",
                  focusedField === "message" ? "text-primary" : "text-muted-foreground"
                )} />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tell us about your requirements (optional)"
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background text-[15px] focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Enquiry
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-2">
              By submitting, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</a>
              {" "}and{" "}
              <a href="/terms-and-conditions" className="text-primary hover:underline font-medium">Terms of Service</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
