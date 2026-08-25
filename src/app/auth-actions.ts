"use server";

import { signOut } from "@/auth";

/** Ends the current Auth.js session and returns the visitor to the portfolio. */
export async function signOutFromNavigation() {
  await signOut({ redirectTo: "/" });
}
