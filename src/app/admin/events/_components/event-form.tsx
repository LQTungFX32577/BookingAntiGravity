"use client"
"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { upsertEvent } from "../_actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Trash, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"), // We'll handle date as string in input
    location: z.string().min(1, "Location is required"),
    imageUrl: z.string().optional(),
    ticketTypes: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number().min(0),
        quantity: z.coerce.number().min(1),
    })).min(1, "At least one ticket type is required")
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
    initialData?: {
        id: string
        title: string
        description: string
        date: Date
        location: string
        imageUrl: string | null
        ticketTypes: {
            name: string
            price: number
            quantity: number
        }[]
    } | null
}

export function EventForm({ initialData }: EventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const defaultValues: EventFormValues = initialData ? {
        title: initialData.title,
        description: initialData.description,
        date: new Date(initialData.date).toISOString().slice(0, 16),
        location: initialData.location,
        imageUrl: initialData.imageUrl || "",
        ticketTypes: initialData.ticketTypes.map(t => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity
        }))
    } : {
        title: "",
        description: "",
        date: "",
        location: "",
        imageUrl: "",
        ticketTypes: [{ name: "General Admission", price: 0, quantity: 100 }]
    }

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema) as any,
        defaultValues
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "ticketTypes"
    })

    async function onSubmit(data: EventFormValues) {
        setLoading(true)
        try {
            const result = await upsertEvent({
                ...data,
                date: new Date(data.date),
                id: initialData?.id
            })

            if (result.success) {
                router.push("/admin/events")
                router.refresh()
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Summer Festival" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date & Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Central Park, NY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Event details..." className="h-32" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Ticket Types</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", price: 0, quantity: 0 })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Ticket Type
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <Card key={field.id}>
                            <CardContent className="p-4 grid gap-4 md:grid-cols-4 items-end">
                                <FormField
                                    control={form.control}
                                    name={`ticketTypes.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VIP" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`ticketTypes.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`ticketTypes.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Event"}
                </Button>
            </form>
        </Form>
    )
}
