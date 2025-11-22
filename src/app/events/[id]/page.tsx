import { prisma } from "@/lib/prisma"
import { Header } from "@/components/user/Header"
import { Footer } from "@/components/user/Footer"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { MapPin, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { TicketSelector } from "@/components/user/TicketSelector"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EventDetailsPage({ params }: PageProps) {
    const { id } = await params
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            ticketTypes: true
        }
    })

    if (!event) {
        notFound()
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="aspect-video relative rounded-xl overflow-hidden bg-muted">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>{format(event.date, "PPP")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    <span>{format(event.date, "p")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-2">About this event</h3>
                                <p className="whitespace-pre-wrap">{event.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Ticket Selection */}
                    <div className="lg:col-span-1">
                        <TicketSelector eventId={event.id} ticketTypes={event.ticketTypes} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
