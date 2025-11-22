'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().transform((str) => new Date(str)),
  location: z.string().min(1, 'Location is required'),
  imageUrl: z.string().optional(),
  ticketTypes: z
    .array(
      z.object({
        name: z.string().min(1, 'Ticket name is required'),
        price: z.coerce.number().min(0, 'Price must be positive'),
        quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'At least one ticket type is required'),
});

export async function createEvent(prevState: any, formData: FormData) {
  // This is a simplified example. In a real app, you'd parse formData properly
  // or use a library like zsa or next-safe-action for type safety.
  // For this demo, we'll assume the form submits JSON or structured data,
  // but standard server actions with formData are tricky with nested arrays.
  // So we'll expect the client to submit a JSON string for complex fields or handle it differently.

  // Actually, let's make this receive a raw object for simplicity with client-side RHF submission
  return { message: 'Use client-side submission for complex nested forms' };
}

// We will use a direct server action called from the client component for simplicity with RHF
export async function upsertEvent(
  data: z.infer<typeof eventSchema> & { id?: string }
) {
  const { id, ticketTypes, ...eventData } = data;

  try {
    if (id) {
      // Update
      await prisma.event.update({
        where: { id },
        data: {
          ...eventData,
          ticketTypes: {
            deleteMany: {}, // Simplest strategy: delete all and recreate
            create: ticketTypes,
          },
        },
      });
    } else {
      // Create
      await prisma.event.create({
        data: {
          ...eventData,
          ticketTypes: {
            create: ticketTypes,
          },
        },
      });
    }

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to save event' };
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete event' };
  }
}
