import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[v0] Discord auth initiation")

  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

  console.log("[v0] Config check:", {
    clientId: clientId ? "set" : "missing",
    redirectUri: redirectUri ? redirectUri : "missing",
  })

  if (!clientId || !redirectUri) {
    console.error("[v0] Discord OAuth not configured")
    return NextResponse.json({ error: "Discord OAuth not configured" }, { status: 500 })
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email`

  console.log("[v0] Redirecting to Discord:", discordAuthUrl)
  return NextResponse.redirect(discordAuthUrl)
}
