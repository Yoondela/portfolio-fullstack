import { describe, expect, it } from "vitest";
import {
  screenshotInputSchema,
  screenshotUploadMetadataSchema,
} from "../screenshot-validation";

const validScreenshotInput = {
  storagePath: "projects/project-id/features/feature-id/screenshot.webp",
  altText: "Project screenshot",
  displayOrder: 0,
};

describe("screenshot storage path validation", () => {
  it("accepts a relative screenshot object path", () => {
    expect(screenshotInputSchema.safeParse(validScreenshotInput).success).toBe(
      true
    );
  });

  it.each([
    "/projects/project-id/screenshot.webp",
    "projects/../screenshot.webp",
    "projects//screenshot.webp",
  ])("rejects an unsafe screenshot path: %s", (storagePath) => {
    expect(
      screenshotInputSchema.safeParse({ ...validScreenshotInput, storagePath })
        .success
    ).toBe(false);
  });
});

describe("screenshot upload metadata validation", () => {
  it("accepts an allowed image type within the upload limit", () => {
    expect(
      screenshotUploadMetadataSchema.safeParse({
        contentType: "image/webp",
        size: 5 * 1024 * 1024,
      }).success
    ).toBe(true);
  });

  it.each([
    { contentType: "image/gif", size: 1024 },
    { contentType: "image/png", size: 0 },
    { contentType: "image/jpeg", size: 5 * 1024 * 1024 + 1 },
  ])("rejects invalid image upload metadata: %o", (metadata) => {
    expect(screenshotUploadMetadataSchema.safeParse(metadata).success).toBe(
      false
    );
  });
});
