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
        <div className="group h-[400px] w-full [perspective:1000px]">
            <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Face */}
                <Card className="absolute inset-0 h-full w-full overflow-hidden border-2 [backface-visibility:hidden]">
                    <div className="h-3/5 relative bg-muted">
                        {event.imageUrl ? (
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/50">
                                <div className="text-center">
                                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No Image</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-primary/90 backdrop-blur text-primary-foreground shadow-lg font-semibold">
                                {minPrice === 0 ? "Free Entry" : `From $${minPrice}`}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader className="pb-2">
                        <h3 className="font-bold text-xl line-clamp-2">{event.title}</h3>
                    </CardHeader>
                    <CardContent className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{format(event.date, "PPP p")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Back Face */}
                <Card className="absolute inset-0 h-full w-full overflow-hidden border-2 bg-primary text-primary-foreground [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col">
                    <CardHeader>
                        <h3 className="font-bold text-xl line-clamp-2 text-primary-foreground">{event.title}</h3>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
                        <p className="text-primary-foreground/90 text-sm leading-relaxed">
                            {event.description}
                        </p>
                    </CardContent>
                    <CardFooter className="pt-4 bg-primary-foreground/10 backdrop-blur-sm mt-auto">
                        <Link href={`/events/${event.id}`} className="w-full">
                            <Button variant="secondary" className="w-full font-bold shadow-lg hover:shadow-xl transition-all">
                                <Ticket className="mr-2 h-4 w-4" />
                                Book Now
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
