import { z } from "zod";
import {
  SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES,
  SCREENSHOT_UPLOAD_MAX_SIZE_BYTES,
} from "./screenshot-storage-config";

/** Validates image metadata before issuing an upload capability. */
export const screenshotUploadMetadataSchema = z.object({
  contentType: z.enum(SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES),
  size: z
    .number()
    .int()
    .positive("Screenshot file size must be greater than zero")
    .max(
      SCREENSHOT_UPLOAD_MAX_SIZE_BYTES,
      "Screenshot file must not exceed 5 MB"
    ),
});

/** Validates a relative object path used by the screenshot Storage bucket. */
export const screenshotStoragePathSchema = z
  .string()
  .trim()
  .min(1, "Screenshot storage path is required")
  .max(1024)
  .refine(
    (value) => {
      const segments = value.split("/");

      return (
        !value.startsWith("/") &&
        segments.every(
          (segment) => segment.length > 0 && segment !== "." && segment !== ".."
        )
      );
    },
    "Screenshot storage path must be a relative object path"
  );

/** Validates database references to screenshot objects in Supabase Storage. */
export const screenshotInputSchema = z.object({
  storagePath: screenshotStoragePathSchema,
  altText: z.string().min(1, "Screenshot alt text is required").max(255),
  displayOrder: z.number().int().nonnegative(),
});

export type ScreenshotInput = z.input<typeof screenshotInputSchema>;
export type ScreenshotUploadMetadata = z.input<
  typeof screenshotUploadMetadataSchema
>;
