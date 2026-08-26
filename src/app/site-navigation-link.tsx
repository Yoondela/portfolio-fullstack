"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinkClassName =
  "underline-offset-4 hover:text-stone-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:hover:text-stone-50";

/** A primary navigation link that marks the current route for visual and screen-reader context. */
export function SiteNavigationLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname !== null && href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${navigationLinkClassName}${isActive ? " text-stone-950 underline dark:text-stone-50" : ""}`}
    >
      {children}
    </Link>
  );
}
