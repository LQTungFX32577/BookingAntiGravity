"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    CalendarDays,
    Ticket,
    Users,
    Settings,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        color: "text-sky-400",
    },
    {
        label: "Events",
        icon: CalendarDays,
        href: "/admin/events",
        color: "text-violet-400",
    },
    {
        label: "Promotions",
        icon: Ticket,
        href: "/admin/promotions",
        color: "text-pink-400",
    },
    {
        label: "Users",
        icon: Users,
        href: "/admin/users",
        color: "text-orange-400",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-r border-slate-800">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin" className="flex items-center pl-3 mb-14 group">
                    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Event<span className="text-primary">Admin</span>
                    </h1>
                </Link>
                <div className="space-y-1.5">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all relative overflow-hidden",
                                isActive(route.href)
                                    ? "text-white bg-primary shadow-lg shadow-primary/20"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive(route.href) && (
                                <div className="absolute inset-0  bg-gradient-to-r from-primary/90 to-primary" />
                            )}
                            <div className="flex items-center flex-1 relative z-10">
                                <route.icon
                                    className={cn(
                                        "h-5 w-5 mr-3",
                                        isActive(route.href) ? "text-primary-foreground" : route.color
                                    )}
                                />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2 border-t border-slate-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => signOut()}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
