import Link from 'next/link';
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
  const currency = supplier.payouts[0]?.currency ?? 'KES';

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link href="/supplier" className="text-sm text-gray-500 hover:underline">
        ← all suppliers
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{supplier.name}</h1>
      <p className="text-sm text-gray-500">{supplier.phone}</p>
      {supplier.trusted && (
        <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
          Trusted Supplier
        </span>
      )}

      <section className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Kg supplied" value={totalKg.toFixed(1)} />
        <Stat label={`Earned (${currency})`} value={totalEarned.toFixed(0)} />
        <Stat label="CO₂ diverted (kg)" value={totalCo2.toFixed(1)} />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Ledger</h2>
        {supplier.batches.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No batches yet.</p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Date</th>
                <th>Category</th>
                <th>Kg</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {supplier.batches.map((b) => (
                <tr key={b.id}>
                  <td className="py-2">{b.createdAt.toISOString().slice(0, 10)}</td>
                  <td>{b.category}</td>
                  <td>{b.weightKg.toFixed(1)}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
