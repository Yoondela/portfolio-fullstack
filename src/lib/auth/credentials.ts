import "server-only";

import { z } from "zod";
import { verifyPassword } from "./password";
import { prisma } from "../prisma";

const credentialsSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

/**
 * Validates an email/password submission and returns the minimal Auth.js user.
 * Password hashes and authorization state never leave the server.
 */
export async function authorizeCredentials(credentials: unknown) {
  const parsedCredentials = credentialsSchema.safeParse(credentials);

  if (!parsedCredentials.success) return null;

  const user = await prisma.user.findUnique({
    where: { email: parsedCredentials.data.email },
  });

  if (!user) return null;

  const passwordMatches = await verifyPassword(
    parsedCredentials.data.password,
    user.passwordHash
  );

  if (!passwordMatches) return null;

  return { id: user.id, email: user.email };
}
