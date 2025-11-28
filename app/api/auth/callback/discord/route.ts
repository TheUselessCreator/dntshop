import { type NextRequest, NextResponse } from "next/server"
import { setUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  console.log("[v0] Discord callback hit:", request.url)
  console.log("[v0] Request method:", request.method)
  console.log("[v0] Headers:", Object.fromEntries(request.headers.entries()))

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  console.log("[v0] Code received:", code ? "yes" : "no")

  if (!code) {
    console.log("[v0] No code in callback, redirecting to login")
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    const clientId = process.env.DISCORD_CLIENT_ID
    const clientSecret = process.env.DISCORD_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

    console.log("[v0] Discord config check:", {
      clientId: clientId ? "set" : "missing",
      clientSecret: clientSecret ? "set" : "missing",
      redirectUri: redirectUri ? redirectUri : "missing",
    })

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Discord OAuth not configured")
    }

    // Exchange code for access token
    console.log("[v0] Exchanging code for token...")
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("[v0] Token exchange failed:", tokenResponse.status, errorData)
      throw new Error("Failed to exchange code for token")
    }

    const { access_token } = await tokenResponse.json()
    console.log("[v0] Token received successfully")

    // Get user info
    console.log("[v0] Fetching user info...")
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error("[v0] User info fetch failed:", userResponse.status)
      throw new Error("Failed to get user info")
    }

    const discordUser = await userResponse.json()
    console.log("[v0] User info received:", discordUser.username)

    // Set user session
    await setUser({
      id: discordUser.id,
      email: discordUser.email || `${discordUser.username}@discord.user`,
      name: discordUser.global_name || discordUser.username,
      avatar: discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : undefined,
      provider: "discord",
    })

    console.log("[v0] User session set, redirecting to home")
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("[v0] Discord OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] POST request to callback (test)")
  return NextResponse.json({ message: "Callback route is accessible" })
}
