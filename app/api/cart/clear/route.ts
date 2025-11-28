import { type NextRequest, NextResponse } from "next/server"
import { clearCart } from "@/lib/cart"

export async function POST(request: NextRequest) {
  await clearCart()
  return NextResponse.json({ success: true })
}
