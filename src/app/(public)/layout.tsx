import Link from "next/link";

/** Shared shell for the public portfolio routes. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-stone-300/80 bg-stone-50/75 dark:border-stone-700 dark:bg-stone-950/75">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="font-serif text-lg tracking-[0.18em] text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:text-stone-100"
          >
            ENGINEER PORTFOLIO
          </Link>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-4 text-sm text-stone-700 dark:text-stone-300 sm:gap-6">
              <li>
                <Link
                  href="/"
                  className="underline-offset-4 hover:text-stone-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:hover:text-stone-50"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/engineering"
                  className="underline-offset-4 hover:text-stone-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:hover:text-stone-50"
                >
                  Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="underline-offset-4 hover:text-stone-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:hover:text-stone-50"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        {children}
      </main>

      <footer className="border-t border-stone-300/80 px-5 py-6 text-sm text-stone-600 dark:border-stone-700 dark:text-stone-400 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <p>Selected engineering work.</p>
          <p>© 2026</p>
        </div>
      </footer>
    </div>
  );
}
