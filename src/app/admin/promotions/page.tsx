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
import { Plus, Pencil, Trash, Check, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { deletePromotion, togglePromotionStatus } from "./_actions"
import { revalidatePath } from "next/cache"

export default async function PromotionsPage() {
    const promotions = await prisma.promotion.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Promotions</h1>
                <Link href="/admin/promotions/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Promotion
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Valid Until</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {promotions.map((promotion) => (
                            <TableRow key={promotion.id}>
                                <TableCell className="font-medium font-mono">{promotion.code}</TableCell>
                                <TableCell>{promotion.discountPercent}%</TableCell>
                                <TableCell>{format(promotion.validUntil, "PPP")}</TableCell>
                                <TableCell>
                                    <Badge variant={promotion.isActive ? "default" : "destructive"}>
                                        {promotion.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/promotions/${promotion.id}/edit`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        'use server'
                                        await deletePromotion(promotion.id)
                                    }} className="inline-block">
                                        <Button variant="ghost" size="icon" className="text-red-500">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                        {promotions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No promotions found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
