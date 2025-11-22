"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, UserCog, Shield, ShieldAlert } from "lucide-react"
import { deleteUser, updateUserRole } from "../_actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface UserActionsProps {
    user: {
        id: string
        role: string
        email: string
    }
}

export function UserActions({ user }: UserActionsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function onDelete() {
        if (!confirm("Are you sure you want to delete this user?")) return

        setLoading(true)
        try {
            const result = await deleteUser(user.id)
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    async function onRoleChange(newRole: "ADMIN" | "USER") {
        setLoading(true)
        try {
            const result = await updateUserRole(user.id, newRole)
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(user.id)}
                >
                    Copy User ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.role === "USER" ? (
                    <DropdownMenuItem onClick={() => onRoleChange("ADMIN")} disabled={loading}>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => onRoleChange("USER")} disabled={loading}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Make User
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-red-600" disabled={loading}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
