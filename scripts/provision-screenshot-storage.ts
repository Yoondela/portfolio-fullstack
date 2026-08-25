import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import {
  SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES,
  SCREENSHOT_UPLOAD_MAX_SIZE_BYTES,
} from "@/lib/screenshot-storage-config";
import { getSupabaseProjectUrl } from "@/lib/supabase-project-url";

if (!globalThis.WebSocket) {
  Object.defineProperty(globalThis, "WebSocket", {
    configurable: true,
    value: WebSocket,
    writable: true,
  });
}

async function main() {
  const storage = createClient(
    getSupabaseProjectUrl(requiredEnvironmentVariable("SUPABASE_URL")),
    requiredEnvironmentVariable("SUPABASE_SECRET_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  ).storage;
  const bucketName = requiredEnvironmentVariable("SUPABASE_STORAGE_BUCKET");

  const bucketOptions = {
    public: true,
    allowedMimeTypes: [...SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES],
    fileSizeLimit: SCREENSHOT_UPLOAD_MAX_SIZE_BYTES,
  };

  const { data: buckets, error: listError } = await storage.listBuckets();
  if (listError) throw listError;

  const bucketExists = buckets.some(
    (bucket) => bucket.id === bucketName
  );
  const { error } = bucketExists
    ? await storage.updateBucket(bucketName, bucketOptions)
    : await storage.createBucket(bucketName, bucketOptions);

  if (error) throw error;

  console.log(
    `${bucketExists ? "Updated" : "Created"} ${bucketName} bucket.`
  );
}

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
