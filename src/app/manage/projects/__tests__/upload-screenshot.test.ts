import { afterEach, describe, expect, it, vi } from "vitest";

import { uploadScreenshotFile } from "../upload-screenshot";

describe("uploadScreenshotFile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads the selected file to the signed URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const file = new File(["image"], "screenshot.webp", {
      type: "image/webp",
    });

    await expect(
      uploadScreenshotFile("https://example.supabase.co/signed-upload", file)
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.supabase.co/signed-upload",
      expect.objectContaining({
        method: "PUT",
        body: file,
        headers: {
          "cache-control": "max-age=3600",
          "content-type": "image/webp",
          "x-upsert": "false",
        },
      })
    );
  });

  it("reports a rejected signed upload", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const file = new File(["image"], "screenshot.webp", {
      type: "image/webp",
    });

    await expect(
      uploadScreenshotFile("https://example.supabase.co/signed-upload", file)
    ).rejects.toThrow("Screenshot upload failed.");
  });
});
