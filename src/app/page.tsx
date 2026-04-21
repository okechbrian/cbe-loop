import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Circular Bio-Economy Loop</h1>
      <p className="mt-2 text-gray-600">
        Paid household waste procurement → Poultry, Mushrooms, Vegetables.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/supplier"
          className="rounded-lg border border-gray-200 p-6 transition hover:border-gray-400"
        >
          <h2 className="text-xl font-semibold">Supplier app →</h2>
          <p className="mt-1 text-sm text-gray-600">
            Ledger of kg supplied, earnings, and CO₂ diverted.
          </p>
        </Link>

        <Link
          href="/intake"
          className="rounded-lg border border-gray-200 p-6 transition hover:border-gray-400"
        >
          <h2 className="text-xl font-semibold">Intake station →</h2>
          <p className="mt-1 text-sm text-gray-600">
            Operator weigh-in: classify, approve, pay.
          </p>
        </Link>
      </div>
    </main>
  );
}
