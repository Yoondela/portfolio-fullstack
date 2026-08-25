/** File constraints that the Supabase bucket and future upload actions must enforce. */
export const SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const SCREENSHOT_UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;
