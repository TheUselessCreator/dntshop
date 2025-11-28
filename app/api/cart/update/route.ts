import { type NextRequest, NextResponse } from "next/server"
import { updateCartItem } from "@/lib/cart"

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    await updateCartItem(productId, quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
