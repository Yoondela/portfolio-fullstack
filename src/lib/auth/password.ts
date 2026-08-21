import "server-only";

import * as argon2 from "argon2";

/** Hash a password with Argon2id before storing it. */
export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

/** Verify a submitted password against its stored Argon2id hash. */
export function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return argon2.verify(passwordHash, password);
}
