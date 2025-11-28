import { type NextRequest, NextResponse } from "next/server"
import { addToCart } from "@/lib/cart"

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
    }

    await addToCart(productId, quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
