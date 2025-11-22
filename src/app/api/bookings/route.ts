import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bookingSchema = z.object({
  eventId: z.string(),
  items: z.array(
    z.object({
      ticketTypeId: z.string(),
      quantity: z.number().min(1),
    })
  ),
  totalAmount: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount } = bookingSchema.parse(body);

    // Verify stock and calculate total again for security
    let calculatedTotal = 0;

    // Start transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Check stock for all items
      for (const item of items) {
        const ticketType = await tx.ticketType.findUnique({
          where: { id: item.ticketTypeId },
        });

        if (!ticketType) {
          throw new Error(`Ticket type not found: ${item.ticketTypeId}`);
        }

        if (ticketType.quantity < item.quantity) {
          throw new Error(`Not enough stock for ${ticketType.name}`);
        }

        calculatedTotal += ticketType.price * item.quantity;

        // Decrement stock
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { quantity: ticketType.quantity - item.quantity },
        });
      }

      // Create booking
      return await tx.booking.create({
        data: {
          userId: session.user.id,
          totalAmount: calculatedTotal,
          status: 'CONFIRMED', // Auto-confirm for demo
          items: {
            create: items.map((item) => ({
              ticketTypeId: item.ticketTypeId,
              quantity: item.quantity,
            })),
          },
        },
      });
    });

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
