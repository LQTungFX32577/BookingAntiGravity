import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash } from "lucide-react"
import Link from "next/link"

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            ticketTypes: true
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Events</h1>
                <Link href="/admin/events/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Tickets</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{format(event.date, "PPP")}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>
                                    {event.ticketTypes.reduce((acc, type) => acc + type.quantity, 0)} total
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/events/${event.id}/edit`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    {/* We'll add delete functionality later */}
                                    <Button variant="ghost" size="icon" className="text-red-500">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {events.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No events found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
