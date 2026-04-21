import { prisma } from '@/lib/prisma';
import { recordBatch } from '@/app/actions/intake';

export const dynamic = 'force-dynamic';

export default async function IntakePage() {
  const suppliers = await prisma.supplier.findMany({
    where: { removed: false },
    orderBy: { name: 'asc' },
  });
  const rateCard = await prisma.rateCard.findMany({
    where: { active: true },
    orderBy: { category: 'asc' },
  });
  const recent = await prisma.wasteBatch.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { supplier: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Intake station</h1>
      <p className="mt-1 text-sm text-gray-600">
        Weigh in a supplier batch. The classifier stub will auto-flag some for human review.
      </p>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {rateCard.map((r) => (
          <div key={r.id} className="rounded-lg border border-gray-200 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">{r.category}</div>
            <div className="mt-1 text-lg font-semibold">
              {r.currency} {r.pricePerKg} / kg
            </div>
          </div>
        ))}
      </section>

      <form
        action={recordBatch}
        className="mt-8 space-y-4 rounded-lg border border-gray-200 p-6"
      >
        <div>
          <label className="block text-sm font-medium">Supplier</label>
          <select
            name="supplierId"
            required
            className="mt-1 w-full rounded border border-gray-300 p-2"
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
            className="mt-1 w-full rounded border border-gray-300 p-2"
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
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Weigh in &amp; pay
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent batches</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No batches yet.</p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Time</th>
                <th>Supplier</th>
                <th>Cat</th>
                <th>Kg</th>
                <th>Score</th>
                <th>Status</th>
                <th>Routed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map((b) => (
                <tr key={b.id}>
                  <td className="py-2">
                    {b.createdAt.toISOString().slice(11, 16)}
                  </td>
                  <td>{b.supplier.name}</td>
                  <td>{b.category}</td>
                  <td>{b.weightKg.toFixed(1)}</td>
                  <td>{b.classifierScore?.toFixed(2) ?? '—'}</td>
                  <td>{b.status}</td>
                  <td>{b.routedStage ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
