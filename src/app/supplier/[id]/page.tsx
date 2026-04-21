import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SupplierLedger({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      batches: { orderBy: { createdAt: 'desc' } },
      payouts: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!supplier) notFound();

  const totalKg = supplier.batches
    .filter((b) => b.status === 'APPROVED')
    .reduce((s, b) => s + b.weightKg, 0);
  const totalEarned = supplier.payouts
    .filter((p) => p.status === 'PAID')
    .reduce((s, p) => s + p.amount, 0);
  const totalCo2 = supplier.batches.reduce((s, b) => s + b.co2DivertedKg, 0);
  const currency = supplier.payouts[0]?.currency ?? 'UGX';

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mt-2 text-2xl font-bold">{supplier.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.phone}</p>
      {supplier.trusted && (
        <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-200">
          Trusted Supplier
        </span>
      )}

      <section className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Kg supplied" value={totalKg.toFixed(1)} />
        <Stat label={`Earned (${currency})`} value={totalEarned.toLocaleString('en-UG')} />
        <Stat label="CO₂ diverted (kg)" value={totalCo2.toFixed(1)} />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Ledger</h2>
        {supplier.batches.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No batches yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Kg</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {supplier.batches.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2">{b.createdAt.toISOString().slice(0, 10)}</td>
                    <td className="px-3 py-2">{b.category}</td>
                    <td className="px-3 py-2">{b.weightKg.toFixed(1)}</td>
                    <td className="px-3 py-2">{b.status}</td>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
