import { prisma } from "@/lib/prisma"
import { PromotionForm } from "../../_components/promotion-form"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditPromotionPage({ params }: PageProps) {
    const { id } = await params
    const promotion = await prisma.promotion.findUnique({
        where: { id }
    })

    if (!promotion) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Promotion</h1>
            <PromotionForm initialData={promotion} />
        </div>
    )
}
