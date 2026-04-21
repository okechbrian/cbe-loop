import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const batches = await prisma.wasteBatch.findMany({
    include: { supplier: true, payout: true },
    orderBy: { createdAt: 'asc' },
  });

  const header = [
    'batch_id',
    'created_at',
    'supplier_name',
    'supplier_phone',
    'category',
    'weight_kg',
    'status',
    'classifier_score',
    'human_review',
    'routed_stage',
    'co2_diverted_kg',
    'payout_amount',
    'payout_currency',
    'payout_status',
    'payout_ref',
  ];

  const rows = batches.map((b) =>
    [
      b.id,
      b.createdAt.toISOString(),
      b.supplier.name,
      b.supplier.phone,
      b.category,
      b.weightKg,
      b.status,
      b.classifierScore ?? '',
      b.humanReview ? '1' : '0',
      b.routedStage ?? '',
      b.co2DivertedKg,
      b.payout?.amount ?? '',
      b.payout?.currency ?? '',
      b.payout?.status ?? '',
      b.payout?.providerRef ?? '',
    ]
      .map(csvCell)
      .join(','),
  );

  const body = [header.join(','), ...rows].join('\n');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cbe-loop-report-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
