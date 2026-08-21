import "server-only";

import type { User } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the current session to the database-backed administrator record.
 * Call this before every protected mutation so revoked admin access takes
 * effect even when a JWT remains valid.
 */
export async function requireAdmin(): Promise<User> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user?.isAdmin) throw new Error("Forbidden");

  return user;
}
