"use client"

import { useState } from "react"
import { ShoppingCart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Product {
  ProductID: number
  ProductName: string
  ProductPrice: number
}

export function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.ProductID, quantity: 1 }),
      })

      if (res.ok) {
        toast({
          title: "Added to cart",
          description: `${product.ProductName} has been added to your cart`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-110 transition-transform">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-2 pb-4">
        <h3 className="font-bold text-xl text-balance">{product.ProductName}</h3>
        <p className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
          ${product.ProductPrice.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full group-hover:shadow-lg transition-shadow"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
