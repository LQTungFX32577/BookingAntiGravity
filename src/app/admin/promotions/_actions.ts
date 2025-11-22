'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const promotionSchema = z.object({
  code: z.string().min(1, 'Code is required').toUpperCase(),
  discountPercent: z.coerce
    .number()
    .min(0)
    .max(100, 'Discount must be between 0 and 100'),
  validUntil: z.string().transform((str) => new Date(str)),
  isActive: z.boolean().default(true),
});

export async function upsertPromotion(
  data: z.infer<typeof promotionSchema> & { id?: string }
) {
  try {
    const { id, ...promotionData } = data;

    if (id) {
      await prisma.promotion.update({
        where: { id },
        data: promotionData,
      });
    } else {
      // Check for duplicate code
      const existing = await prisma.promotion.findUnique({
        where: { code: promotionData.code },
      });
      if (existing) {
        return { success: false, error: 'Promotion code already exists' };
      }

      await prisma.promotion.create({
        data: promotionData,
      });
    }

    revalidatePath('/admin/promotions');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to save promotion' };
  }
}

export async function deletePromotion(id: string) {
  try {
    await prisma.promotion.delete({
      where: { id },
    });
    revalidatePath('/admin/promotions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete promotion' };
  }
}

export async function togglePromotionStatus(id: string, isActive: boolean) {
  try {
    await prisma.promotion.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/admin/promotions');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status' };
  }
}
