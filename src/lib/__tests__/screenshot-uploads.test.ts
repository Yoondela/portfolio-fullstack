import { afterEach, describe, expect, it, vi } from "vitest";

const {
  mockCreateSignedScreenshotUploadUrl,
  mockDeleteScreenshotStorageObjects,
  mockFeatureFindUnique,
  mockRandomUUID,
  mockScreenshotFindUnique,
} = vi.hoisted(() => ({
  mockCreateSignedScreenshotUploadUrl: vi.fn(),
  mockDeleteScreenshotStorageObjects: vi.fn(),
  mockFeatureFindUnique: vi.fn(),
  mockRandomUUID: vi.fn(),
  mockScreenshotFindUnique: vi.fn(),
}));

vi.mock("node:crypto", () => ({ randomUUID: mockRandomUUID }));
vi.mock("../prisma", () => ({
  prisma: {
    feature: { findUnique: mockFeatureFindUnique },
    screenshot: { findUnique: mockScreenshotFindUnique },
  },
}));
vi.mock("../supabase-storage", () => ({
  createSignedScreenshotUploadUrl: mockCreateSignedScreenshotUploadUrl,
  deleteScreenshotStorageObjects: mockDeleteScreenshotStorageObjects,
}));

import {
  createScreenshotUploadUrl,
  deletePendingScreenshotUpload,
} from "../screenshot-uploads";

const featureId = "22222222-2222-4222-8222-222222222222";
const projectId = "11111111-1111-4111-8111-111111111111";

describe("createScreenshotUploadUrl", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("creates a feature-owned path with an extension derived from the MIME type", async () => {
    mockFeatureFindUnique.mockResolvedValue({ projectId });
    mockRandomUUID.mockReturnValue("new-object-id");
    mockCreateSignedScreenshotUploadUrl.mockResolvedValue({
      signedUrl: "https://example.supabase.co/signed-upload",
      token: "upload-token",
    });

    await expect(
      createScreenshotUploadUrl(featureId, {
        contentType: "image/png",
        size: 1024,
      })
    ).resolves.toEqual({
      storagePath: `projects/${projectId}/features/${featureId}/new-object-id.png`,
      signedUrl: "https://example.supabase.co/signed-upload",
      token: "upload-token",
    });

    expect(mockFeatureFindUnique).toHaveBeenCalledWith({
      where: { id: featureId },
      select: { projectId: true },
    });
  });

  it("does not issue an upload capability for a missing feature", async () => {
    mockFeatureFindUnique.mockResolvedValue(null);

    await expect(
      createScreenshotUploadUrl(featureId, {
        contentType: "image/jpeg",
        size: 1024,
      })
    ).rejects.toThrow("Feature not found.");

    expect(mockCreateSignedScreenshotUploadUrl).not.toHaveBeenCalled();
  });

  it("removes only an unfinalized object owned by the target feature", async () => {
    mockFeatureFindUnique.mockResolvedValue({ projectId });
    mockScreenshotFindUnique.mockResolvedValue(null);
    const storagePath = `projects/${projectId}/features/${featureId}/pending.webp`;

    await deletePendingScreenshotUpload(featureId, storagePath);

    expect(mockDeleteScreenshotStorageObjects).toHaveBeenCalledWith([
      storagePath,
    ]);
  });

  it("keeps an object that has already been finalized as a screenshot", async () => {
    mockFeatureFindUnique.mockResolvedValue({ projectId });
    mockScreenshotFindUnique.mockResolvedValue({ id: "screenshot-id" });
    const storagePath = `projects/${projectId}/features/${featureId}/finalized.webp`;

    await deletePendingScreenshotUpload(featureId, storagePath);

    expect(mockScreenshotFindUnique).toHaveBeenCalledWith({
      where: { storagePath },
      select: { id: true },
    });
    expect(mockDeleteScreenshotStorageObjects).not.toHaveBeenCalled();
  });

  it("does not remove an object outside the target feature", async () => {
    mockFeatureFindUnique.mockResolvedValue({ projectId });

    await expect(
      deletePendingScreenshotUpload(
        featureId,
        `projects/${projectId}/features/other/pending.webp`
      )
    ).rejects.toThrow("does not belong to this feature");

    expect(mockDeleteScreenshotStorageObjects).not.toHaveBeenCalled();
  });
});
