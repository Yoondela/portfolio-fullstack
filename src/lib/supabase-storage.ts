import "server-only";

import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { getSupabaseProjectUrl } from "./supabase-project-url";
export {
  SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES,
  SCREENSHOT_UPLOAD_MAX_SIZE_BYTES,
} from "./screenshot-storage-config";

/** Bucket used exclusively for publicly served portfolio screenshots. */
export const SCREENSHOT_STORAGE_BUCKET = requiredEnvironmentVariable(
  "SUPABASE_STORAGE_BUCKET"
);

const supabaseUrl = getSupabaseProjectUrl(
  requiredEnvironmentVariable("SUPABASE_URL")
);
const supabaseSecretKey = requiredEnvironmentVariable("SUPABASE_SECRET_KEY");

if (!globalThis.WebSocket) {
  Object.defineProperty(globalThis, "WebSocket", {
    configurable: true,
    value: WebSocket,
    writable: true,
  });
}

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
