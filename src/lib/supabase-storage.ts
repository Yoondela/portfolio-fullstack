import "server-only";

import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { getSupabaseProjectUrl } from "./supabase-project-url";
import { ScreenshotStorageVerificationError } from "./screenshot-storage-errors";
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

/** Returns the public URL for a screenshot object stored in the configured bucket. */
export function getPublicScreenshotUrl(storagePath: string): string {
  return supabaseStorage.storage
    .from(SCREENSHOT_STORAGE_BUCKET)
    .getPublicUrl(storagePath).data.publicUrl;
}

/** Creates a short-lived browser upload capability for an exact object path. */
export async function createSignedScreenshotUploadUrl(
  storagePath: string
): Promise<{ signedUrl: string; token: string }> {
  const { data, error } = await supabaseStorage.storage
    .from(SCREENSHOT_STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    throw new Error("Screenshot upload URL could not be created.");
  }

  return { signedUrl: data.signedUrl, token: data.token };
}

/** Verifies that an existing screenshot object can be found in the configured bucket. */
export async function assertScreenshotStorageObject(
  storagePath: string
): Promise<void> {
  const { data: exists, error } = await supabaseStorage.storage
    .from(SCREENSHOT_STORAGE_BUCKET)
    .exists(storagePath);

  if (error || !exists) {
    throw new ScreenshotStorageVerificationError(
      "Screenshot storage object does not exist."
    );
  }
}

/** Removes screenshot objects before their database records are deleted. */
export async function deleteScreenshotStorageObjects(
  storagePaths: string[]
): Promise<void> {
  const uniqueStoragePaths = [...new Set(storagePaths)];
  if (uniqueStoragePaths.length === 0) return;

  const { error } = await supabaseStorage.storage
    .from(SCREENSHOT_STORAGE_BUCKET)
    .remove(uniqueStoragePaths);

  if (error) {
    throw new Error("Screenshot storage cleanup failed.");
  }
}

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
