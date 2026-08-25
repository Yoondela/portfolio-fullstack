import Link from "next/link";
import { AccountMenu } from "./account-menu";

/** Primary navigation shared across public and protected application pages. */
export function SiteNavigation({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="border-b border-stone-300/80 bg-stone-50/75 dark:border-stone-700 dark:bg-stone-950/75 sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 py-5 sm:grid-cols-[1fr_auto_1fr] sm:px-8">
        <Link
          href="/"
          className="font-serif text-lg tracking-[0.18em] text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:text-stone-100"
        >
          YONDELA SASAYI
        </Link>
        <nav
          aria-label="Primary navigation"
          className="col-span-2 row-start-2 justify-self-center sm:col-span-1 sm:col-start-2 sm:row-start-1"
        >
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-700 dark:text-stone-300 sm:gap-x-6">
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
            {isSignedIn && (
              <li>
                <Link
                  href="/manage/projects"
                  className="underline-offset-4 hover:text-stone-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:hover:text-stone-50"
                >
                  Manage projects
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="col-start-2 row-start-1 justify-self-end sm:col-start-3">
          <AccountMenu isSignedIn={isSignedIn} />
        </div>
      </div>
    </header>
  );
}

/** Footer shared across public and protected application pages. */
export function SiteFooter() {
  return (
    <footer className="border-t border-stone-300/80 px-5 py-6 text-sm text-stone-600 dark:border-stone-700 dark:text-stone-400 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <p>Selected engineering work.</p>
        <p>© 2026</p>
      </div>
    </footer>
  );
}
