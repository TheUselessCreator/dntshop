"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { generateOrderId } from "@/lib/cart"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

export function CheckoutView({ items }: { items: CartItem[] }) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [showDialog, setShowDialog] = useState(false)

  const total = items.reduce((sum, item) => sum + (item.product?.ProductPrice || 0) * item.quantity, 0)

  const handleCheckout = async () => {
    setProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate order ID
    const cart = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))
    const newOrderId = generateOrderId(cart)

    // Clear cart
    await fetch("/api/cart/clear", { method: "POST" })

    setOrderId(newOrderId)
    setShowDialog(true)
    setProcessing(false)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>
                      {item.product?.ProductName} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${((item.product?.ProductPrice || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} disabled={processing} size="lg" className="w-full">
              {processing ? "Processing..." : "Complete Checkout"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Completed!</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your checkout ID is:</p>
                <p className="font-mono text-lg font-bold text-foreground break-all">{orderId}</p>
              </div>
              <p className="text-foreground">
                Please join our Discord and make a ticket with your order ID to complete your purchase.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleCloseDialog} className="w-full">
            Got it!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
