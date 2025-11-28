"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CartItem {
  productId: number
  quantity: number
  product?: {
    ProductID: number
    ProductName: string
    ProductPrice: number
    ProductImage: string
  }
}

export function CartView({ items }: { items: CartItem[] }) {
  const router = useRouter()
  const [updating, setUpdating] = useState<number | null>(null)

  const updateQuantity = async (productId: number, quantity: number) => {
    setUpdating(productId)
    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
      router.refresh()
    } finally {
      setUpdating(null)
    }
  }

  const total = items.reduce((sum, item) => sum + (item.product?.ProductPrice || 0) * item.quantity, 0)

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.productId}>
            <CardContent className="p-4 flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={item.product?.ProductImage || ""}
                  alt={item.product?.ProductName || ""}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.product?.ProductName}</h3>
                  <p className="text-lg font-bold">${item.product?.ProductPrice.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={updating === item.productId}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-12 text-center font-medium">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={updating === item.productId}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto text-destructive"
                    onClick={() => updateQuantity(item.productId, 0)}
                    disabled={updating === item.productId}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card className="sticky top-4">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
