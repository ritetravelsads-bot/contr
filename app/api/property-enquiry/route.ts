import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import {
  sendEmail,
  propertyEnquiryAdminTemplate,
  propertyEnquiryUserTemplate,
} from "@/lib/email"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { 
      name, 
      email, 
      phone, 
      message, 
      property_id, 
      property_name,
      property_slug 
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        )
      }
    }

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }

    // Save enquiry to database
    const db = await getDatabase()
    const enquiry = {
      name,
      email: email || "",
      phone,
      message: message || "",
      property_id: property_id || "",
      property_name: property_name || "",
      property_slug: property_slug || "",
      source: "property_detail_page",
      status: "new",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("enquiries").insertOne(enquiry)

    // Send email notification to admin
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `New Property Enquiry: ${property_name || "General"}`,
      html: propertyEnquiryAdminTemplate({
        name,
        email,
        phone,
        message,
        property_name,
        property_slug,
      }),
    })

    // Send confirmation email to user if email provided
    if (email) {
      await sendEmail({
        to: email,
        subject: `Thank you for your enquiry - Country Roof`,
        html: propertyEnquiryUserTemplate({
          name,
          property_name,
          property_slug,
        }),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Property Enquiry API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    )
  }
}
