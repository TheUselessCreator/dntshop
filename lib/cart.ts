export interface CartItem {
  productId: number
  quantity: number
}

// Helper function that parses cart from a cookie string
export function getCartFromCookie(cookieValue: string | undefined): CartItem[] {
  if (!cookieValue) {
    return []
  }

  try {
    return JSON.parse(cookieValue)
  } catch {
    return []
  }
}

// Helper function to serialize cart for cookie storage
export function serializeCart(cart: CartItem[]): string {
  return JSON.stringify(cart)
}

// Helper function to add item to cart array
export function addItemToCart(cart: CartItem[], productId: number, quantity = 1): CartItem[] {
  const existingItem = cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }

  return cart
}

// Helper function to update cart item quantity
export function updateCartItemQuantity(cart: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return cart.filter((item) => item.productId !== productId)
  }

  const item = cart.find((item) => item.productId === productId)
  if (item) {
    item.quantity = quantity
  }

  return cart
}

// Generate order ID from cart items
export function generateOrderId(cart: CartItem[]): string {
  return "Order-" + cart.map((item) => `${item.productId}:${item.quantity}`).join("_")
}
