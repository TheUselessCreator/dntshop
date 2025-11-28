import { cookies } from "next/headers"

export interface CartItem {
  productId: number
  quantity: number
}

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get("cart")

  if (!cartCookie) {
    return []
  }

  try {
    return JSON.parse(cartCookie.value)
  } catch {
    return []
  }
}

export async function setCart(cart: CartItem[]) {
  const cookieStore = await cookies()
  cookieStore.set("cart", JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function addToCart(productId: number, quantity = 1) {
  const cart = await getCart()
  const existingItem = cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }

  await setCart(cart)
}

export async function updateCartItem(productId: number, quantity: number) {
  const cart = await getCart()
  const item = cart.find((item) => item.productId === productId)

  if (item) {
    if (quantity <= 0) {
      await setCart(cart.filter((item) => item.productId !== productId))
    } else {
      item.quantity = quantity
      await setCart(cart)
    }
  }
}

export async function clearCart() {
  const cookieStore = await cookies()
  cookieStore.delete("cart")
}

export function generateOrderId(cart: CartItem[]): string {
  return "Order-" + cart.map((item) => `${item.productId}:${item.quantity}`).join("_")
}
