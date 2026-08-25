import { describe, expect, it } from "vitest";
import { screenshotInputSchema } from "../screenshot-validation";

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
