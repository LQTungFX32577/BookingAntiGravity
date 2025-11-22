import { prisma } from "@/lib/prisma"
import { EventForm } from "../../_components/event-form"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params
    const event = await prisma.event.findUnique({
        where: { id },
        include: { ticketTypes: true }
    })

    if (!event) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Event</h1>
            <div className="max-w-3xl">
                <EventForm initialData={event} />
            </div>
        </div>
    )
}
