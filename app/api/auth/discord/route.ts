import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Discord OAuth not configured" }, { status: 500 })
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
  })

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`

  return NextResponse.redirect(discordAuthUrl)
}
