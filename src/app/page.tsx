import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Future Makers Hackathon 2026 · National Science Week · Uganda
      </div>

      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        Circular Bio-Economy Loop
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        Paid household waste procurement → Poultry · Mushrooms · Vegetables.
        An AI-coordinated loop that turns Kampala&apos;s organic waste into farm
        revenue, household income, and audit-grade green-credit data.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <NavCard
          href="/supplier"
          title="Supplier app"
          blurb="Per-household ledger: kg supplied, UGX earned, CO₂ diverted."
        />
        <NavCard
          href="/intake"
          title="Intake station"
          blurb="Operator weigh-in, AI classifier, instant mobile-money payout."
        />
        <NavCard
          href="/farm"
          title="Farm dashboard"
          blurb="Live inventory across poultry, mushroom, and vegetable stages."
        />
        <NavCard
          href="/report"
          title="Green-credit report"
          blurb="Sustainability metrics for loan officers and certifiers."
        />
      </div>

      <section className="mt-10 rounded-lg border border-gray-200 p-5 text-sm dark:border-gray-800">
        <h2 className="font-semibold">How the loop pays for itself</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700 dark:text-gray-300">
          <li>Households pre-sort waste into GREEN / BROWN / REJECT bins.</li>
          <li>At the aggregation point, an AI classifier confirms category + flags contamination.</li>
          <li>Supplier is paid instantly via mobile money (UGX, stubbed in this prototype).</li>
          <li>GREEN → poultry feed supplementation · BROWN → mushroom substrate.</li>
          <li>Poultry manure + spent substrate → vegetable beds. Nothing exits the loop as waste.</li>
        </ol>
      </section>
    </main>
  );
}

function NavCard({ href, title, blurb }: { href: string; title: string; blurb: string }) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-gray-200 p-5 transition hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
    >
      <h2 className="text-lg font-semibold">
        {title} <span className="text-gray-400 transition group-hover:text-gray-600 dark:group-hover:text-gray-300">→</span>
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{blurb}</p>
    </Link>
  );
}
