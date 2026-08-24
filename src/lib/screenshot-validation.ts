import { z } from "zod";

/** Validates URL-based screenshots while persistent file storage remains deferred. */
export const screenshotInputSchema = z.object({
  url: z
    .string()
    .url()
      .refine(
      (value) => {
        try {
          const protocol = new URL(value).protocol;
          return protocol === "http:" || protocol === "https:";
        } catch {
          return false;
        }
      },
      "Screenshot URL must use http or https"
    ),
  altText: z.string().min(1, "Screenshot alt text is required").max(255),
  displayOrder: z.number().int().nonnegative(),
});

export type ScreenshotInput = z.input<typeof screenshotInputSchema>;
