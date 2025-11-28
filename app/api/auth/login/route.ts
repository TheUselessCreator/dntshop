import { type NextRequest, NextResponse } from "next/server"
import { setUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Simple authentication (in production, verify against database)
    // For demo purposes, accept any email/password
    await setUser({
      id: `email_${Date.now()}`,
      email,
      name: email.split("@")[0],
      provider: "email",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
