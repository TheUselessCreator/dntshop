import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Discord OAuth not configured" }, { status: 500 })
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email`

  return NextResponse.redirect(discordAuthUrl)
}
