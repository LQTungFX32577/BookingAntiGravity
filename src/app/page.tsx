import { prisma } from "@/lib/prisma"
import { Header } from "@/components/user/Header"
import { Footer } from "@/components/user/Footer"
import { EventCard } from "@/components/user/EventCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LandingPage() {
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    },
    include: {
      ticketTypes: true
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary-foreground/10 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium">🎉 Discover Amazing Events Near You</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Your Gateway to
              <br />
              <span className="bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-primary-foreground/80 bg-clip-text text-transparent">
                Unforgettable Experiences
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Book tickets for the best concerts, workshops, conferences, and cultural events.
              Join thousands of event-goers creating memorable moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" asChild className="min-w-[180px] shadow-lg hover:shadow-xl transition-all">
                <Link href="#events">
                  Browse Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-w-[180px] bg-transparent border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground hover:text-primary-foreground">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated selection of exciting events happening near you
            </p>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
              <p className="text-xl font-semibold mb-2">No upcoming events found</p>
              <p className="text-muted-foreground">Check back later for new exciting events!</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
