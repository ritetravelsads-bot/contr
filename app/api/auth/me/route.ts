import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    // Return 200 with user: null instead of 401 to avoid console errors
    // This is a common pattern for auth check endpoints
    if (!user) {
      return new Response(JSON.stringify({ success: true, user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          user_type: user.user_type,
          profile_picture: user.profile_picture,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, user: null, error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
