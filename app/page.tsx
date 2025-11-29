import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { getUser } from "@/lib/auth"
import { getCartFromCookie } from "@/lib/cart"
import { cookies } from "next/headers"

export default async function HomePage() {
  const user = await getUser()
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get("cart")
  const cart = user ? getCartFromCookie(cartCookie?.value) : []
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} cartCount={cartCount} />

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl w-full space-y-8 py-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-balance bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              DonutAce
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance">
              Your premium shop for DonutSMP items
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button size="lg" className="text-lg px-8">
                Browse Shop
              </Button>
            </Link>
            {!user && (
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Only the finest ingredients in every product</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick and reliable service every time</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">We're here to help whenever you need</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
