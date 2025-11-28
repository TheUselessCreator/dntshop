"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Product {
  ProductID: number
  ProductName: string
  ProductPrice: number
  ProductImage: string
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
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.ProductImage || "/placeholder.svg"}
          alt={product.ProductName}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-balance">{product.ProductName}</h3>
        <p className="text-2xl font-bold">${product.ProductPrice.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} disabled={loading} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
