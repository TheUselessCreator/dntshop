import { getUser } from "@/lib/auth"
import { getCart } from "@/lib/cart"
import { Header } from "@/components/header"
import { CartView } from "@/components/cart-view"
import { redirect } from "next/navigation"
import products from "@/data/products.json"

export default async function CartPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const cart = await getCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.ProductID === item.productId)
      return {
        ...item,
        product,
      }
    })
    .filter((item) => item.product)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} cartCount={cartCount} />

      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <CartView items={cartItems} />
      </main>
    </div>
  )
}
