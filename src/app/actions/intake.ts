'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { classifyStub } from '@/lib/classify';
import { co2DivertedKg, type WasteCategoryKey } from '@/lib/co2';
import { routeBatchToStage } from '@/lib/routing';
import { sendPayoutStub } from '@/lib/payout';

export async function recordBatch(formData: FormData) {
  const supplierId = String(formData.get('supplierId') ?? '');
  const category = String(formData.get('category') ?? '') as WasteCategoryKey;
  const weightKg = Number(formData.get('weightKg') ?? 0);
  const photo = formData.get('photo');

  if (!supplierId || !['GREEN', 'BROWN', 'REJECT'].includes(category) || weightKg <= 0) {
    throw new Error('Invalid input');
  }

  let photoPath: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    const buf = Buffer.from(await photo.arrayBuffer());
    await fs.writeFile(filePath, buf);
    photoPath = `/uploads/${filename}`;
  }

  const supplier = await prisma.supplier.findUniqueOrThrow({ where: { id: supplierId } });
  const rate = await prisma.rateCard.findFirst({
    where: { category, active: true },
    orderBy: { createdAt: 'desc' },
  });
  if (!rate) throw new Error('No active rate card for category');

  const clf = classifyStub(category, photoPath ?? undefined);
  const approved = !clf.needsHumanReview && category !== 'REJECT';
  const co2 = approved ? co2DivertedKg(category, weightKg) : 0;
  const routed = approved ? await routeBatchToStage(category, weightKg) : null;

  const batch = await prisma.wasteBatch.create({
    data: {
      supplierId,
      category,
      weightKg,
      photoPath: photoPath ?? undefined,
      classifierLabel: clf.label,
      classifierScore: clf.score,
      humanReview: clf.needsHumanReview,
      status: approved ? 'APPROVED' : clf.needsHumanReview ? 'PENDING_REVIEW' : 'REJECTED',
      routedStage: routed ?? undefined,
      co2DivertedKg: co2,
    },
  });

  if (approved) {
    const amount = rate.pricePerKg * weightKg;
    const res = await sendPayoutStub({
      phone: supplier.phone,
      amount,
      currency: rate.currency,
      reference: batch.id,
    });

    await prisma.payout.create({
      data: {
        supplierId,
        batchId: batch.id,
        amount,
        currency: rate.currency,
        status: res.ok ? 'PAID' : 'FAILED',
        providerRef: res.ok ? res.providerRef : null,
        paidAt: res.ok ? new Date() : null,
      },
    });

    if (routed) {
      await prisma.inventoryCounter.update({
        where: { stage: routed },
        data: { onHandKg: { increment: weightKg } },
      });
    }
  }

  revalidatePath('/intake');
  revalidatePath('/supplier');
  revalidatePath('/farm');
  revalidatePath('/report');
  redirect(`/intake?last=${batch.id}`);
}
