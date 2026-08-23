import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/authorization";

/**
 * Redirects unauthorized visitors before rendering the management shell.
 * Protected pages still authorize beside their own data reads because layouts
 * do not re-run on every client-side navigation.
 */
export default async function ManageLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Unauthorized" || error.message === "Forbidden")
    ) {
      redirect("/api/auth/signin?callbackUrl=%2Fmanage");
    }

    throw error;
  }

  return children;
}
