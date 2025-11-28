import { type NextRequest, NextResponse } from "next/server"
import { clearUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  await clearUser()
  return NextResponse.json({ success: true })
}
