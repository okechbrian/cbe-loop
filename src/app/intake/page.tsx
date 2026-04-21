import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { recordBatch } from '@/app/actions/intake';

export const dynamic = 'force-dynamic';

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{ last?: string }>;
}) {
  const { last } = await searchParams;

  const [suppliers, rateCard, recent, lastBatch] = await Promise.all([
    prisma.supplier.findMany({ where: { removed: false }, orderBy: { name: 'asc' } }),
    prisma.rateCard.findMany({ where: { active: true }, orderBy: { category: 'asc' } }),
    prisma.wasteBatch.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { supplier: true },
    }),
    last
      ? prisma.wasteBatch.findUnique({
          where: { id: last },
          include: { supplier: true, payout: true },
        })
      : null,
  ]);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Intake station</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Weigh in a supplier batch. The AI classifier auto-flags low-confidence batches
        for human review.
      </p>

      {lastBatch && <DecisionBanner batch={lastBatch} />}

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {rateCard.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {r.category}
            </div>
            <div className="mt-1 text-lg font-semibold">
              {r.currency} {r.pricePerKg.toLocaleString('en-UG')} / kg
            </div>
          </div>
        ))}
      </section>

      <form
        action={recordBatch}
        encType="multipart/form-data"
        className="mt-8 space-y-4 rounded-lg border border-gray-200 p-6 dark:border-gray-800"
      >
        <div>
          <label className="block text-sm font-medium">Supplier</label>
          <select
            name="supplierId"
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">— select —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.phone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            required
            defaultValue="GREEN"
            className="mt-1 w-full rounded border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="GREEN">Green (high-nitrogen)</option>
            <option value="BROWN">Brown (high-carbon)</option>
            <option value="REJECT">Reject</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input
            name="weightKg"
            type="number"
            step="0.1"
            min="0.1"
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Photo of batch</label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="mt-1 w-full rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Captured at the weighing station; runs through the AI classifier.
          </p>
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Weigh in &amp; pay
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent batches</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No batches yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Supplier</th>
                  <th className="px-3 py-2">Cat</th>
                  <th className="px-3 py-2">Kg</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Routed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recent.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2">{b.createdAt.toISOString().slice(11, 16)}</td>
                    <td className="px-3 py-2">{b.supplier.name}</td>
                    <td className="px-3 py-2">{b.category}</td>
                    <td className="px-3 py-2">{b.weightKg.toFixed(1)}</td>
                    <td className="px-3 py-2">{b.classifierScore?.toFixed(2) ?? '—'}</td>
                    <td className="px-3 py-2">{b.status}</td>
                    <td className="px-3 py-2">{b.routedStage ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function DecisionBanner({
  batch,
}: {
  batch: {
    id: string;
    category: string;
    weightKg: number;
    classifierScore: number | null;
    humanReview: boolean;
    status: string;
    routedStage: string | null;
    photoPath: string | null;
    supplier: { name: string; phone: string };
    payout: { amount: number; currency: string; providerRef: string | null } | null;
  };
}) {
  const approved = batch.status === 'APPROVED';
  const color = approved
    ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950'
    : batch.humanReview
    ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
    : 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950';

  return (
    <div className={`mt-6 rounded-lg border p-5 ${color}`}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {batch.photoPath && (
          <Image
            src={batch.photoPath}
            alt="batch"
            width={112}
            height={112}
            unoptimized
            className="h-28 w-28 shrink-0 rounded border border-gray-200 object-cover dark:border-gray-700"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {approved ? 'Approved' : batch.humanReview ? 'Flagged for review' : 'Rejected'}
            </span>
            <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium dark:bg-black/30">
              AI: {batch.category} · score{' '}
              {batch.classifierScore?.toFixed(2) ?? '—'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {batch.supplier.name} · {batch.weightKg.toFixed(1)} kg{' '}
            {batch.routedStage && <>→ routed to {batch.routedStage}</>}
          </p>
          {batch.payout && (
            <p className="mt-1 text-sm font-medium">
              💸 MoMo sent: {batch.payout.currency}{' '}
              {batch.payout.amount.toLocaleString('en-UG')} →{' '}
              {batch.supplier.phone}
              {batch.payout.providerRef && (
                <span className="ml-2 text-xs text-gray-500">
                  ref {batch.payout.providerRef}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
