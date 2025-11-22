import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
  const password = await hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  console.log({ admin });

  // Create a regular user
  const userPassword = await hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log({ user });

  // Delete existing events to avoid duplicates when re-seeding
  await prisma.event.deleteMany({});

  // Create sample events
  const events = await prisma.event.createMany({
    data: [
      {
        title: 'Summer Music Festival',
        description:
          'A day of great music and fun under the summer sun. Featuring top artists from around the world.',
        date: new Date('2026-07-15T18:00:00Z'),
        location: 'Central Park, New York',
        imageUrl:
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1000&q=80',
      },
      {
        title: 'Tech Conference 2026',
        description:
          'Join industry leaders for insights into the future of technology and innovation.',
        date: new Date('2026-08-20T09:00:00Z'),
        location: 'Convention Center, San Francisco',
        imageUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      },
      {
        title: 'Food & Wine Expo',
        description:
          'Discover culinary delights and exquisite wines from local and international vendors.',
        date: new Date('2026-09-10T12:00:00Z'),
        location: 'Downtown Arena, Chicago',
        imageUrl:
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
      },
      {
        title: 'Marathon 2026',
        description:
          'Challenge yourself in this annual marathon event for all fitness levels.',
        date: new Date('2026-10-05T06:00:00Z'),
        location: 'City Streets, Boston',
        imageUrl:
          'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=80',
      },
      {
        title: 'Art Gallery Opening',
        description:
          'Exclusive opening of contemporary art exhibition featuring emerging artists.',
        date: new Date('2026-06-25T19:00:00Z'),
        location: 'Metropolitan Museum, Los Angeles',
        imageUrl:
          'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80',
      },
    ],
  });

  console.log(`Created ${events.count} events`);

  // Create ticket types for each event
  const allEvents = await prisma.event.findMany();

  for (const event of allEvents) {
    await prisma.ticketType.createMany({
      data: [
        {
          eventId: event.id,
          name: 'General Admission',
          price: 50,
          quantity: 100,
        },
        {
          eventId: event.id,
          name: 'VIP',
          price: 150,
          quantity: 20,
        },
      ],
    });
  }

  console.log('Created ticket types for all events');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
