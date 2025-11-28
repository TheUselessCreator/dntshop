import { type NextRequest, NextResponse } from "next/server"
import { getCartFromCookie, updateCartItemQuantity, serializeCart } from "@/lib/cart"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const cartCookie = cookieStore.get("cart")
    const cart = getCartFromCookie(cartCookie?.value)

    const updatedCart = updateCartItemQuantity(cart, productId, quantity)

    cookieStore.set("cart", serializeCart(updatedCart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
