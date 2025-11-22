import { EventForm } from "../_components/event-form"

export default function NewEventPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create Event</h1>
            <div className="max-w-3xl">
                <EventForm />
            </div>
        </div>
    )
}
