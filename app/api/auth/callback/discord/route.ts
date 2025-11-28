import { type NextRequest, NextResponse } from "next/server"
import { setUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    const clientId = process.env.DISCORD_CLIENT_ID
    const clientSecret = process.env.DISCORD_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Discord OAuth not configured")
    }

    // Exchange code for access token
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
      throw new Error("Failed to exchange code for token")
    }

    const { access_token } = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const discordUser = await userResponse.json()

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

    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Discord OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
  }
}
