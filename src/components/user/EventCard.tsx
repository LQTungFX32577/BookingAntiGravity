import Link from "next/link"
import { format } from "date-fns"
import { MapPin, Calendar, Ticket } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
    event: {
        id: string
        title: string
        description: string
        date: Date
        location: string
        imageUrl: string | null
        ticketTypes: {
            price: number
        }[]
    }
}

export function EventCard({ event }: EventCardProps) {
    const minPrice = Math.min(...event.ticketTypes.map(t => t.price))

    return (
        <Card className="group overflow-hidden flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50">
            <div className="aspect-video relative bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        <div className="text-center">
                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No Image</p>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                    <Badge className="bg-primary/90 backdrop-blur text-primary-foreground hover:bg-primary shadow-lg font-semibold">
                        {minPrice === 0 ? "Free Entry" : `From $${minPrice}`}
                    </Badge>
                </div>
            </div>
            <CardHeader className="pb-3">
                <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pb-4">
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {event.description}
                </p>
                <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(event.date, "PPP p")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Link href={`/events/${event.id}`} className="w-full">
                    <Button className="w-full group-hover:shadow-lg transition-shadow">
                        <Ticket className="mr-2 h-4 w-4" />
                        Book Now
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
