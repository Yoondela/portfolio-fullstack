import { z } from "zod";

/** Validates database references to screenshot objects in Supabase Storage. */
export const screenshotInputSchema = z.object({
  storagePath: z
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
            (segment) =>
              segment.length > 0 && segment !== "." && segment !== ".."
          )
        );
      },
      "Screenshot storage path must be a relative object path"
    ),
  altText: z.string().min(1, "Screenshot alt text is required").max(255),
  displayOrder: z.number().int().nonnegative(),
});

export type ScreenshotInput = z.input<typeof screenshotInputSchema>;
