'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const t =
      (document.documentElement.dataset.theme as 'light' | 'dark' | undefined) ?? 'light';
    setTheme(t);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('cbe-theme', next);
    } catch {}
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-black/60">
      <div className="flex items-center gap-3">
        {!isHome ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            aria-label="Go back"
          >
            ← Back
          </button>
        ) : (
          <span className="w-[68px]" aria-hidden />
        )}
        <Link href="/" className="text-sm font-semibold tracking-tight">
          CBE Loop
        </Link>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀ Light' : '☾ Dark'}
      </button>
    </header>
  );
}
