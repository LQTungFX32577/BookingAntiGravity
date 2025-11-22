"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface TicketType {
    id: string
    name: string
    price: number
    quantity: number
}

interface TicketSelectorProps {
    eventId: string
    ticketTypes: TicketType[]
}

export function TicketSelector({ eventId, ticketTypes }: TicketSelectorProps) {
    const router = useRouter()
    const [selections, setSelections] = useState<Record<string, number>>({})

    const updateQuantity = (ticketId: string, delta: number) => {
        setSelections(prev => {
            const current = prev[ticketId] || 0
            const ticket = ticketTypes.find(t => t.id === ticketId)
            if (!ticket) return prev

            const newQuantity = Math.max(0, Math.min(ticket.quantity, current + delta))

            if (newQuantity === 0) {
                const { [ticketId]: _, ...rest } = prev
                return rest
            }

            return { ...prev, [ticketId]: newQuantity }
        })
    }

    const totalAmount = ticketTypes.reduce((acc, ticket) => {
        return acc + (ticket.price * (selections[ticket.id] || 0))
    }, 0)

    const totalTickets = Object.values(selections).reduce((a, b) => a + b, 0)

    const handleBooking = () => {
        const params = new URLSearchParams()
        Object.entries(selections).forEach(([ticketId, quantity]) => {
            params.append("tickets", `${ticketId}:${quantity}`)
        })
        router.push(`/events/${eventId}/book?${params.toString()}`)
    }

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {ticketTypes.map(ticket => (
                    <div key={ticket.id} className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                            <div className="font-medium">{ticket.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {ticket.price === 0 ? "Free" : `$${ticket.price}`}
                                {ticket.quantity > 0 ? ` • ${ticket.quantity} left` : " • Sold Out"}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(ticket.id, -1)}
                                disabled={!selections[ticket.id]}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-4 text-center">{selections[ticket.id] || 0}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(ticket.id, 1)}
                                disabled={(selections[ticket.id] || 0) >= ticket.quantity}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleBooking}
                        disabled={totalTickets === 0}
                    >
                        Proceed to Booking
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
