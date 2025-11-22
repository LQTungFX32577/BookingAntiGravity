import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/user/Header"
import { Footer } from "@/components/user/Footer"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Ticket } from "lucide-react"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        redirect("/api/auth/signin")
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            items: {
                include: {
                    ticketType: {
                        include: {
                            event: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="mb-12">
                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-6">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
                                        <span className="text-4xl font-bold text-primary">
                                            {session.user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold mb-2">{session.user.name}</h1>
                                    <p className="text-muted-foreground text-lg">{session.user.email}</p>
                                    <div className="mt-3 flex items-center gap-4 text-sm">
                                        <Badge variant="secondary" className="text-sm px-3 py-1">
                                            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            Member since {format(new Date(), "MMMM yyyy")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">My Bookings</h2>
                        <p className="text-muted-foreground mt-1">Track and manage your event bookings</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {bookings.map((booking) => {
                        const event = booking.items[0]?.ticketType.event
                        if (!event) return null

                        const statusConfig = {
                            CONFIRMED: {
                                variant: "default" as const,
                                className: "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
                            },
                            PENDING: {
                                variant: "secondary" as const,
                                className: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20",
                            },
                            CANCELLED: {
                                variant: "destructive" as const,
                                className: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
                            }
                        }

                        const config = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.PENDING

                        return (
                            <Card key={booking.id} className="hover:shadow-lg transition-shadow border-2">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-2xl mb-3">{event.title}</CardTitle>
                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">{format(event.date, "PPP p")}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <Badge className={config.className}>
                                                {booking.status}
                                            </Badge>
                                            <div className="text-2xl font-bold text-primary">
                                                ${booking.totalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-t pt-4 bg-muted/30 -mx-6 px-6 pb-0 -mb-6 rounded-b-lg">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                                            <Ticket className="h-4 w-4" />
                                            Ticket Details
                                        </h4>
                                        <div className="space-y-2.5 pb-4">
                                            {booking.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-background rounded-lg">
                                                    <span className="font-medium">
                                                        <span className="text-primary font-bold">{item.quantity}x</span> {item.ticketType.name}
                                                    </span>
                                                    <span className="font-semibold">
                                                        ${(item.ticketType.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {bookings.length === 0 && (
                        <Card className="border-2 border-dashed">
                            <CardContent className="text-center py-16">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Ticket className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                                <p className="text-muted-foreground mb-6">Start exploring amazing events and book your first ticket!</p>
                                <a href="/" className="inline-flex items-center justify-center rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6">
                                    Browse Events
                                </a>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
