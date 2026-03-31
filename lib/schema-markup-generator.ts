// Schema Markup Generators for SEO

interface FAQItem {
  id: string
  question: string
  answer: string
}

export function generateBlogSchema(post: any, authorName: string) {
  // If the post has pre-generated schema_markup from the editor, use it
  if (post.schema_markup && Array.isArray(post.schema_markup)) {
    return post.schema_markup
  }

  const schemas: object[] = []

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schema_markup?.article_type || "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.banner_image || post.cover_image,
    datePublished: post.publication_date || post.createdAt,
    dateModified: post.updatedAt || post.publication_date || post.createdAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "CountryRoof",
      logo: {
        "@type": "ImageObject",
        url: "https://countryroof.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://countryroof.com/blogs/${post.slug}`,
    },
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.join(", ")
    }),
    articleSection: post.category 
      ? (Array.isArray(post.category) ? post.category[0] : post.category)
      : "Uncategorized"
  }
  schemas.push(articleSchema)

  // FAQ Schema (if FAQs exist)
  if (post.faqs && Array.isArray(post.faqs) && post.faqs.length > 0) {
    const validFaqs = post.faqs.filter((faq: FAQItem) => faq.question?.trim() && faq.answer?.trim())
    if (validFaqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: validFaqs.map((faq: FAQItem) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
      schemas.push(faqSchema)
    }
  }

  // BreadcrumbList Schema - includes category (or Uncategorized) and blog title
  const categoryName = post.category 
    ? (Array.isArray(post.category) ? post.category[0] : post.category)
    : "Uncategorized"
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://countryroof.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: "https://countryroof.com/blogs"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: post.category 
          ? `https://countryroof.com/blogs?category=${encodeURIComponent(categoryName)}`
          : "https://countryroof.com/blogs"
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `https://countryroof.com/blogs/${post.slug}`
      }
    ]
  }
  schemas.push(breadcrumbSchema)

  return schemas
}

export function generatePropertySchema(property: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.property_name,
    description: property.long_description || property.short_description,
    image: [property.main_banner, ...(property.multiple_images || [])],
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.postal_code,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    },
    priceCurrency: "INR",
    price: `${property.lowest_price}-${property.max_price}`,
    priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    availability: property.status === "active" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    numberOfRooms: property.bedrooms,
    numberOfBathroomsUnitComplete: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area_sqft,
      unitCode: "FTK",
    },
    amenityFeature: [
      ...(property.amenities || []).map((amenity: string) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
      })),
      ...(property.luxury_amenities || []).map((amenity: string) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
      })),
    ],
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "CountryRoof",
    url: "https://countryroof.com",
    logo: "/logo.png",
    description: "Premium property marketplace connecting buyers, sellers, and agents",
    sameAs: [
      "https://www.facebook.com/countryroof",
      "https://www.twitter.com/countryroof",
      "https://www.instagram.com/countryroof",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "en",
    },
  }
}
