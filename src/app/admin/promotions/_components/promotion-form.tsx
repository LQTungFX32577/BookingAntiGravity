"use client"

import { useForm } from "react-hook-form"
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
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { upsertPromotion } from "../_actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const promotionSchema = z.object({
    code: z.string().min(1, "Code is required").toUpperCase(),
    discountPercent: z.coerce.number().min(0).max(100, "Discount must be between 0 and 100"),
    validUntil: z.string().min(1, "Valid until date is required"),
    isActive: z.boolean().default(true)
})

type PromotionFormValues = z.infer<typeof promotionSchema>

interface PromotionFormProps {
    initialData?: {
        id: string
        code: string
        discountPercent: number
        validUntil: Date
        isActive: boolean
    } | null
}

export function PromotionForm({ initialData }: PromotionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const defaultValues: PromotionFormValues = initialData ? {
        code: initialData.code,
        discountPercent: initialData.discountPercent,
        validUntil: new Date(initialData.validUntil).toISOString().slice(0, 16),
        isActive: initialData.isActive
    } : {
        code: "",
        discountPercent: 0,
        validUntil: "",
        isActive: true
    }

    const form = useForm<PromotionFormValues>({
        resolver: zodResolver(promotionSchema) as any,
        defaultValues
    })

    async function onSubmit(data: PromotionFormValues) {
        setLoading(true)
        try {
            const result = await upsertPromotion({
                ...data,
                validUntil: new Date(data.validUntil),
                id: initialData?.id
            })

            if (result.success) {
                router.push("/admin/promotions")
                router.refresh()
            } else {
                alert(result.error || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Promotion Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SUMMER2024" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                                    </FormControl>
                                    <FormDescription>
                                        Unique code for the promotion.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discountPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Percentage</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" max="100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="validUntil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valid Until</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Active
                                        </FormLabel>
                                        <FormDescription>
                                            If unchecked, this promotion will not be applicable.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {initialData ? "Update Promotion" : "Create Promotion"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
