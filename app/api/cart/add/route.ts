import { type NextRequest, NextResponse } from "next/server"
import { getCartFromCookie, addItemToCart, serializeCart } from "@/lib/cart"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const cartCookie = cookieStore.get("cart")
    const cart = getCartFromCookie(cartCookie?.value)

    const updatedCart = addItemToCart(cart, productId, quantity)

    cookieStore.set("cart", serializeCart(updatedCart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
