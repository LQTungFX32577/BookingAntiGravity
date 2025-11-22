"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/admin/Sidebar"
import { UserButton } from "@/components/admin/UserButton"

export function Header() {
    return (
        <div className="flex items-center p-4 border-b">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-slate-900 text-white border-none w-72">
                    <Sidebar />
                </SheetContent>
            </Sheet>
            <div className="flex w-full justify-end">
                <UserButton />
            </div>
        </div>
    )
}
