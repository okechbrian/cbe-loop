import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function GreenCreditReport() {
  const [batches, payouts, suppliers] = await Promise.all([
    prisma.wasteBatch.findMany({ where: { status: 'APPROVED' } }),
    prisma.payout.findMany({ where: { status: 'PAID' } }),
    prisma.supplier.findMany({ where: { removed: false } }),
  ]);

  const totalKg = batches.reduce((s, b) => s + b.weightKg, 0);
  const totalCo2 = batches.reduce((s, b) => s + b.co2DivertedKg, 0);
  const totalPaidUgx = payouts.reduce((s, p) => s + p.amount, 0);
  const currency = payouts[0]?.currency ?? 'UGX';
  const suppliersPaid = new Set(payouts.map((p) => p.supplierId)).size;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Green-credit report</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Audit-grade sustainability metrics, ready for loan officers, certifiers, and
            carbon-registry submissions.
          </p>
        </div>
        <a
          href="/api/report/csv"
          className="shrink-0 rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          Download CSV
        </a>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat label="Organic waste diverted" value={`${totalKg.toFixed(1)} kg`} />
        <Stat label="CO₂e avoided" value={`${totalCo2.toFixed(1)} kg`} />
        <Stat label={`Paid to households (${currency})`} value={formatUgx(totalPaidUgx)} />
        <Stat label="Households paid" value={`${suppliersPaid} / ${suppliers.length}`} />
      </section>

      <section className="mt-8 rounded-lg border border-gray-200 p-5 text-sm dark:border-gray-800">
        <h2 className="font-semibold">What this unlocks</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
          <li>Sustainability-linked loans from Equity / Stanbic / Centenary.</li>
          <li>Organic certification via UNBS / URSB.</li>
          <li>Carbon-registry submissions and verified CO₂e reporting.</li>
          <li>Per-household supplier payment history — a base for community credit scoring.</li>
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function formatUgx(n: number) {
  return n.toLocaleString('en-UG', { maximumFractionDigits: 0 });
}
