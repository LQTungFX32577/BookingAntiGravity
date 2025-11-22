import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, DollarSign, Ticket, Users } from "lucide-react"

export default async function AdminDashboardPage() {
    // Fetch stats
    const [totalEvents, totalBookings, totalUsers, totalRevenue] = await Promise.all([
        prisma.event.count(),
        prisma.booking.count(),
        prisma.user.count(),
        prisma.booking.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                status: "CONFIRMED"
            }
        })
    ])

    const stats = [
        {
            title: "Total Revenue",
            value: `$${(totalRevenue._sum.totalAmount || 0).toFixed(2)}`,
            icon: DollarSign,
            description: "From confirmed bookings",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Total Bookings",
            value: totalBookings.toString(),
            icon: Ticket,
            description: "All time bookings",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Total Events",
            value: totalEvents.toString(),
            icon: CalendarDays,
            description: "Active and past events",
            color: "text-violet-500",
            bgColor: "bg-violet-500/10"
        },
        {
            title: "Total Users",
            value: totalUsers.toString(),
            icon: Users,
            description: "Registered users",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground mt-2">Overview của hệ thống quản lý sự kiện</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a href="/admin/events/new" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                            <div className="font-medium">Create New Event</div>
                            <div className="text-sm text-muted-foreground">Add a new event to the platform</div>
                        </a>
                        <a href="/admin/promotions/new" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                            <div className="font-medium">Create Promotion</div>
                            <div className="text-sm text-muted-foreground">Add discount codes for events</div>
                        </a>
                        <a href="/admin/users" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                            <div className="font-medium">Manage Users</div>
                            <div className="text-sm text-muted-foreground">View and manage user accounts</div>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Database</span>
                            <span className="text-sm text-green-500 font-medium">● Online</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">API Status</span>
                            <span className="text-sm text-green-500 font-medium">● Operational</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Last Updated</span>
                            <span className="text-sm text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
