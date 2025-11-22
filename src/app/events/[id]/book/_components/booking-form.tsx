"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface BookingFormProps {
    eventId: string
    items: { ticketTypeId: string, quantity: number }[]
    totalAmount: number
}

export function BookingForm({ eventId, items, totalAmount }: BookingFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function onCheckout() {
        setLoading(true)
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    items,
                    totalAmount
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Booking failed")
            }

            router.push("/profile")
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md text-sm">
                    <p>This is a demo application.</p>
                    <p>No actual payment will be processed.</p>
                </div>

                <Button
                    className="w-full"
                    size="lg"
                    onClick={onCheckout}
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                </Button>
            </CardContent>
        </Card>
    )
}
