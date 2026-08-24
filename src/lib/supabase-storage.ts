import "server-only";

import { createClient } from "@supabase/supabase-js";

/** Bucket used exclusively for publicly served portfolio screenshots. */
export const SCREENSHOT_STORAGE_BUCKET = requiredEnvironmentVariable(
  "SUPABASE_STORAGE_BUCKET"
);

/** File constraints that the Supabase bucket and future upload actions must enforce. */
export const SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const SCREENSHOT_UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const supabaseUrl = requiredEnvironmentVariable("SUPABASE_URL");
const supabaseSecretKey = requiredEnvironmentVariable("SUPABASE_SECRETE_KEY");

/**
 * Server-only Supabase client for privileged screenshot Storage operations.
 * The secret key must never be imported into client-side code.
 */
export const supabaseStorage = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
