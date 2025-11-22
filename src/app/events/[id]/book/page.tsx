import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/user/Header"
import { Footer } from "@/components/user/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { BookingForm } from "./_components/booking-form"

interface PageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ tickets?: string | string[] }>
}

export default async function BookingPage({ params, searchParams }: PageProps) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=" + encodeURIComponent(`/events/${(await params).id}`))
    }

    const { id } = await params
    const { tickets } = await searchParams

    if (!tickets) {
        redirect(`/events/${id}`)
    }

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            ticketTypes: true
        }
    })

    if (!event) {
        redirect("/")
    }

    // Parse tickets param: "ticketId:qty"
    const ticketSelections = (Array.isArray(tickets) ? tickets : [tickets])
        .flatMap(t => t.split(","))
        .reduce((acc, curr) => {
            const [ticketId, qty] = curr.split(":")
            const quantity = parseInt(qty)
            if (ticketId && quantity > 0) {
                acc[ticketId] = (acc[ticketId] || 0) + quantity
            }
            return acc
        }, {} as Record<string, number>)

    const selectedTickets = event.ticketTypes
        .filter(t => ticketSelections[t.id])
        .map(t => ({
            ...t,
            quantity: ticketSelections[t.id]
        }))

    const totalAmount = selectedTickets.reduce((acc, t) => acc + (t.price * t.quantity), 0)

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{event.title}</h3>
                                    <p className="text-muted-foreground">{format(event.date, "PPP p")}</p>
                                    <p className="text-muted-foreground">{event.location}</p>
                                </div>

                                <div className="border-t pt-4 space-y-4">
                                    {selectedTickets.map(ticket => (
                                        <div key={ticket.id} className="flex justify-between">
                                            <div>
                                                <span className="font-medium">{ticket.quantity}x</span> {ticket.name}
                                            </div>
                                            <div>${(ticket.price * ticket.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <BookingForm
                            eventId={event.id}
                            items={selectedTickets.map(t => ({ ticketTypeId: t.id, quantity: t.quantity }))}
                            totalAmount={totalAmount}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
