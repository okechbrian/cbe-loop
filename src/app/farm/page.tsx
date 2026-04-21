import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STAGE_META: Record<string, { label: string; blurb: string }> = {
  POULTRY: { label: 'Poultry', blurb: 'GREEN waste → feed supplementation' },
  MUSHROOM: { label: 'Mushroom', blurb: 'BROWN waste + manure → substrate' },
  VEGETABLE: { label: 'Vegetable', blurb: 'Spent substrate → regenerative beds' },
};

export default async function FarmDashboard() {
  const [counters, recent] = await Promise.all([
    prisma.inventoryCounter.findMany({ orderBy: { stage: 'asc' } }),
    prisma.wasteBatch.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { supplier: true },
    }),
  ]);

  const byStage = Object.fromEntries(counters.map((c) => [c.stage, c]));

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold">Farm dashboard</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Live inventory and routing across the three production stages.
      </p>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {Object.entries(STAGE_META).map(([stage, meta]) => {
          const c = byStage[stage];
          const onHand = c?.onHandKg ?? 0;
          const demand = c?.demandKg ?? 0;
          const pct = demand > 0 ? Math.min(100, Math.round((onHand / demand) * 100)) : 0;
          return (
            <div
              key={stage}
              className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {meta.label}
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {onHand.toFixed(1)}{' '}
                <span className="text-base font-normal text-gray-500">
                  / {demand.toFixed(0)} kg
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{meta.blurb}</p>
              <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-900">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-gray-500">{pct}% of cycle demand</div>
            </div>
          );
        })}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent routed batches</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No approved batches yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Supplier</th>
                  <th className="px-3 py-2">Cat</th>
                  <th className="px-3 py-2">Kg</th>
                  <th className="px-3 py-2">Routed to</th>
                  <th className="px-3 py-2">CO₂ diverted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recent.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2">{b.createdAt.toISOString().slice(11, 16)}</td>
                    <td className="px-3 py-2">{b.supplier.name}</td>
                    <td className="px-3 py-2">{b.category}</td>
                    <td className="px-3 py-2">{b.weightKg.toFixed(1)}</td>
                    <td className="px-3 py-2">{b.routedStage ?? '—'}</td>
                    <td className="px-3 py-2">{b.co2DivertedKg.toFixed(2)} kg</td>
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
