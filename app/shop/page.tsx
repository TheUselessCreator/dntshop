import { getUser } from "@/lib/auth"
import { getCartFromCookie } from "@/lib/cart"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { redirect } from "next/navigation"
import products from "@/data/products.json"
import { cookies } from "next/headers"

export default async function ShopPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const cookieStore = await cookies()
  const cartCookie = cookieStore.get("cart")
  const cart = getCartFromCookie(cartCookie?.value)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} cartCount={cartCount} />

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Shop Our Collection</h1>
          <p className="text-muted-foreground text-lg">Browse our premium selection of donuts</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.ProductID} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
