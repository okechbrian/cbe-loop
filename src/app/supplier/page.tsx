import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SupplierIndex() {
  const suppliers = await prisma.supplier.findMany({
    where: { removed: false },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Suppliers</h1>
      <p className="mt-1 text-sm text-gray-600">
        Pick a household to view their ledger.
      </p>

      <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200">
        {suppliers.map((s) => (
          <li key={s.id}>
            <Link
              href={`/supplier/${s.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span>
                <span className="font-medium">{s.name}</span>
                {s.trusted && (
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Trusted
                  </span>
                )}
                <span className="ml-2 text-sm text-gray-500">{s.phone}</span>
              </span>
              <span className="text-gray-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
