"use client"

import { useState, useEffect, useCallback } from "react"
import { ComboSelect } from "@/components/ui/combo-select"
import { Plus, Trash2, Link2 } from "lucide-react"

// Generate slug from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

interface Option {
  _id: string
  name: string
  [key: string]: any
}

export default function PropertyFormStep1({ formData, onChange }: any) {
  const [developers, setDevelopers] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])
  const [loadingDevelopers, setLoadingDevelopers] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  // Track if slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!formData.slug)
  
  // Handle property name change - auto-generate slug if not manually edited
  const handlePropertyNameChange = useCallback((value: string) => {
    onChange("property_name", value)
    // Only auto-generate slug if it hasn't been manually edited
    if (!slugManuallyEdited) {
      onChange("slug", generateSlug(value))
    }
  }, [onChange, slugManuallyEdited])
  
  // Handle slug change - mark as manually edited
  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallyEdited(true)
    onChange("slug", generateSlug(value))
  }, [onChange])

  useEffect(() => {
    const loadDevelopers = async () => {
      setLoadingDevelopers(true)
      try {
        const res = await fetch("/api/admin/developers")
        const data = await res.json()
        setDevelopers(data)
      } catch (error) {
        console.error("Error loading developers:", error)
      } finally {
        setLoadingDevelopers(false)
      }
    }

    const loadCategories = async () => {
      setLoadingCategories(true)
      try {
        const res = await fetch("/api/admin/categories")
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadDevelopers()
    loadCategories()
  }, [])

  const handleAddDeveloper = async (name: string): Promise<Option | null> => {
    try {
      const res = await fetch("/api/admin/developers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        const newDeveloper = await res.json()
        setDevelopers((prev) => [...prev, newDeveloper].sort((a, b) => a.name.localeCompare(b.name)))
        return newDeveloper
      }
    } catch (error) {
      console.error("Error adding developer:", error)
    }
    return null
  }

  const handleAddCategory = async (name: string): Promise<Option | null> => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon_class: "building" }),
      })
      if (res.ok) {
        const newCategory = await res.json()
        setCategories((prev) => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)))
        return newCategory
      }
    } catch (error) {
      console.error("Error adding category:", error)
    }
    return null
  }

  const handleDeveloperChange = (value: string | string[]) => {
    const selectedName = Array.isArray(value) ? value[0] : value
    const selectedDeveloper = developers.find((d) => d.name === selectedName)
    onChange("developer_id", selectedDeveloper?._id || "")
    onChange("developer_name", selectedName || "")
  }

  const handleCategoryChange = (value: string | string[]) => {
    const selectedName = Array.isArray(value) ? value[0] : value
    onChange("category", selectedName || "")
  }

  const selectedDeveloperName = developers.find((d) => d._id === formData.developer_id)?.name || formData.developer_name || ""

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Listing Type</label>
          <select
            value={formData.listing_type || "new"}
            onChange={(e) => onChange("listing_type", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="builder_project">Builder Project</option>
            <option value="new">New</option>
            <option value="resale">Resale</option>
            <option value="rental">Rental</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Property Category</label>
          <select
            value={formData.property_category || "residential"}
            onChange={(e) => onChange("property_category", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed_use">Mixed-use</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Property Name *</label>
          <input
            type="text"
            value={formData.property_name}
            onChange={(e) => handlePropertyNameChange(e.target.value)}
            placeholder="e.g., Modern 3BHK Apartment"
            required
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Property Type</label>
          <select
            value={formData.property_type}
            onChange={(e) => onChange("property_type", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="shop">Shop</option>
            <option value="sco">SCO</option>
            <option value="office">Office</option>
            <option value="commercial">Commercial</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>
      </div>

      {/* Slug Field - Auto-generated from property name */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">
          <span className="flex items-center gap-1.5">
            <Link2 className="h-3 w-3" />
            URL Slug
          </span>
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/properties/</span>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="auto-generated-from-name"
              className="w-full pl-[85px] pr-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          {slugManuallyEdited && (
            <button
              type="button"
              onClick={() => {
                setSlugManuallyEdited(false)
                onChange("slug", generateSlug(formData.property_name || ""))
              }}
              className="px-3 py-2 text-xs font-medium text-primary hover:text-primary/80 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {slugManuallyEdited 
            ? "Custom URL slug (click Reset to auto-generate from property name)" 
            : "Auto-generated from property name. Edit to customize."}
        </p>
      </div>

      {/* Category Selection with ComboSelect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComboSelect
          label="Category"
          value={formData.category || ""}
          onChange={handleCategoryChange}
          options={categories}
          onAddNew={handleAddCategory}
          placeholder="Select or add a category..."
          loading={loadingCategories}
        />
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Brand/Collection</label>
          <input
            type="text"
            value={formData.brand_collection || ""}
            onChange={(e) => onChange("brand_collection", e.target.value)}
            placeholder="Brand or collection name"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {formData.listing_type === "builder_project" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboSelect
              label="Select Developer/Builder"
              value={selectedDeveloperName}
              onChange={handleDeveloperChange}
              options={developers}
              onAddNew={handleAddDeveloper}
              placeholder="Select or add a developer..."
              loading={loadingDevelopers}
            />
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Project Status</label>
              <select
                value={formData.project_status || "launched"}
                onChange={(e) => onChange("project_status", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="launched">Launched</option>
                <option value="under_construction">Under Construction</option>
                <option value="ready_to_move">Ready to Move</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Target Segment</label>
              <select
                value={formData.target_segment || "mid"}
                onChange={(e) => onChange("target_segment", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="luxury">Luxury</option>
                <option value="premium">Premium</option>
                <option value="mid">Mid-Range</option>
                <option value="affordable">Affordable</option>
              </select>
            </div>
          </div>
        </>
      )}

      {(formData.listing_type === "resale" || formData.listing_type === "rental") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit Status</label>
            <select
              value={formData.unit_status || "vacant"}
              onChange={(e) => onChange("unit_status", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="leased">Leased</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Age of Property (Years)</label>
            <input
              type="number"
              value={formData.age_of_property || ""}
              onChange={(e) => onChange("age_of_property", e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">RERA Registered</label>
          <select
            value={formData.rera_registered ? "yes" : "no"}
            onChange={(e) => onChange("rera_registered", e.target.value === "yes")}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        {formData.rera_registered && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">RERA ID</label>
              <input
                type="text"
                value={formData.rera_id || ""}
                onChange={(e) => onChange("rera_id", e.target.value)}
                placeholder="RERA registration number"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">RERA Website Link</label>
              <input
                type="url"
                value={formData.rera_website_link || ""}
                onChange={(e) => onChange("rera_website_link", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Possession Type</label>
          <select
            value={formData.possession_type}
            onChange={(e) => onChange("possession_type", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="ready">Ready to Move</option>
            <option value="under_construction">Under Construction</option>
            <option value="resale">Resale</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Possession Date</label>
          <input
            type="date"
            value={formData.possession_date}
            onChange={(e) => onChange("possession_date", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Furnishing Type</label>
          <select
            value={formData.furnished_type}
            onChange={(e) => onChange("furnished_type", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi_furnished">Semi-Furnished</option>
            <option value="fully_furnished">Fully Furnished</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Status</label>
          <select
            value={formData.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Short Description</label>
        <textarea
          value={formData.short_description}
          onChange={(e) => onChange("short_description", e.target.value)}
          placeholder="Brief description (50-150 characters)"
          maxLength={150}
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.short_description.length}/150</p>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Long Description</label>
        <textarea
          value={formData.long_description}
          onChange={(e) => onChange("long_description", e.target.value)}
          placeholder="Detailed property description"
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-28"
        />
      </div>

      {/* About Project Section */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-sm font-semibold mb-3">About Project</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              About Sub-heading (Optional)
            </label>
            <input
              type="text"
              value={formData.about_subheading || ""}
              onChange={(e) => onChange("about_subheading", e.target.value)}
              placeholder="e.g., A Premium Living Experience in the Heart of Gurugram"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">This will appear as an h3 sub-heading below the main title</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              About the Project (for property detail page)
            </label>
            <textarea
              value={formData.about_project || ""}
              onChange={(e) => onChange("about_project", e.target.value)}
              placeholder="Write a detailed about section for the project. This will be shown prominently on the property detail page."
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-32"
            />
          </div>
        </div>
      </div>

      {/* Project Highlights Section */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-sm font-semibold mb-3">Project Highlights</h4>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Key Highlights (one per line)
          </label>
          <textarea
            value={(formData.project_highlights || []).join("\n")}
            onChange={(e) => {
              const lines = e.target.value.split("\n").filter((line: string) => line.trim())
              onChange("project_highlights", lines)
            }}
            placeholder={"Premium location in Sector 103\n2-side open plots\nGreen certified project\nSwimming pool & clubhouse\nPrime connectivity to metro"}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-32"
          />
          <p className="text-xs text-muted-foreground mt-1">Enter each highlight on a new line</p>
        </div>
      </div>

      {/* Payment Plan Details */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-sm font-semibold mb-3">Payment Plan</h4>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Payment Plan Details
          </label>
          <textarea
            value={formData.payment_plan_details || ""}
            onChange={(e) => onChange("payment_plan_details", e.target.value)}
            placeholder="e.g., 10:80:10 | Flexi Payment Plan | Down payment options"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
          />
        </div>
      </div>

      {/* Special Sections */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold">Special Sections</h4>
            <p className="text-xs text-muted-foreground">Add custom content sections to the property page</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const newSection = {
                id: Date.now().toString(),
                title: "",
                subtitle: "",
                content: "",
                position: "after_about"
              }
              onChange("special_sections", [...(formData.special_sections || []), newSection])
            }}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>

        {(!formData.special_sections || formData.special_sections.length === 0) ? (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">No special sections added yet</p>
            <button
              type="button"
              onClick={() => {
                const newSection = {
                  id: Date.now().toString(),
                  title: "",
                  subtitle: "",
                  content: "",
                  position: "after_about"
                }
                onChange("special_sections", [newSection])
              }}
              className="text-sm text-primary hover:underline"
            >
              Add your first special section
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {(formData.special_sections || []).map((section: any, index: number) => (
              <div key={section.id || index} className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Section {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.special_sections || []).filter((_: any, i: number) => i !== index)
                      onChange("special_sections", updated)
                    }}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Section Title (H2) *
                    </label>
                    <input
                      type="text"
                      value={section.title || ""}
                      onChange={(e) => {
                        const updated = [...(formData.special_sections || [])]
                        updated[index] = { ...updated[index], title: e.target.value }
                        onChange("special_sections", updated)
                      }}
                      placeholder="e.g., Why Choose This Project?"
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Sub-title (H3) - Optional
                    </label>
                    <input
                      type="text"
                      value={section.subtitle || ""}
                      onChange={(e) => {
                        const updated = [...(formData.special_sections || [])]
                        updated[index] = { ...updated[index], subtitle: e.target.value }
                        onChange("special_sections", updated)
                      }}
                      placeholder="e.g., Discover the unique features that set us apart"
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Content (Paragraph) *
                    </label>
                    <textarea
                      value={section.content || ""}
                      onChange={(e) => {
                        const updated = [...(formData.special_sections || [])]
                        updated[index] = { ...updated[index], content: e.target.value }
                        onChange("special_sections", updated)
                      }}
                      placeholder="Write the main content for this section..."
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Display Position
                    </label>
                    <select
                      value={section.position || "after_about"}
                      onChange={(e) => {
                        const updated = [...(formData.special_sections || [])]
                        updated[index] = { ...updated[index], position: e.target.value }
                        onChange("special_sections", updated)
                      }}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="after_about">After About Section</option>
                      <option value="after_highlights">After Project Highlights</option>
                      <option value="after_details">After Property Details</option>
                      <option value="after_enquiry">After Enquiry Form</option>
                      <option value="after_units">After Units Section</option>
                      <option value="after_amenities">After Amenities</option>
                      <option value="after_gallery">After Gallery</option>
                      <option value="after_floor_plans">After Floor Plans</option>
                      <option value="after_location">After Location</option>
                      <option value="before_faq">Before FAQs</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Choose where this section appears on the property page</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
