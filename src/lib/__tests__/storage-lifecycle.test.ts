import { afterEach, describe, expect, it, vi } from "vitest";

const {
  mockAssertScreenshotStorageObject,
  mockDeleteScreenshotStorageObjects,
  mockFeatureDelete,
  mockFeatureFindUnique,
  mockProjectDelete,
  mockProjectFindUnique,
  mockScreenshotCreate,
  mockScreenshotDelete,
  mockScreenshotFindUnique,
} = vi.hoisted(() => ({
  mockAssertScreenshotStorageObject: vi.fn(),
  mockDeleteScreenshotStorageObjects: vi.fn(),
  mockFeatureDelete: vi.fn(),
  mockFeatureFindUnique: vi.fn(),
  mockProjectDelete: vi.fn(),
  mockProjectFindUnique: vi.fn(),
  mockScreenshotCreate: vi.fn(),
  mockScreenshotDelete: vi.fn(),
  mockScreenshotFindUnique: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    feature: {
      delete: mockFeatureDelete,
      findUnique: mockFeatureFindUnique,
    },
    project: {
      delete: mockProjectDelete,
      findUnique: mockProjectFindUnique,
    },
    screenshot: {
      create: mockScreenshotCreate,
      delete: mockScreenshotDelete,
      findUnique: mockScreenshotFindUnique,
    },
  },
}));
vi.mock("../supabase-storage", () => ({
  assertScreenshotStorageObject: mockAssertScreenshotStorageObject,
  deleteScreenshotStorageObjects: mockDeleteScreenshotStorageObjects,
}));

import { deleteFeature } from "../features";
import { deleteProject } from "../projects";
import { createScreenshot, deleteScreenshot } from "../screenshots";

const projectId = "11111111-1111-4111-8111-111111111111";
const featureId = "22222222-2222-4222-8222-222222222222";
const screenshotId = "33333333-3333-4333-8333-333333333333";
const storagePath = `projects/${projectId}/features/${featureId}/screenshot.webp`;

describe("screenshot storage lifecycle", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("verifies a feature-owned object before creating its screenshot record", async () => {
    mockFeatureFindUnique.mockResolvedValue({ projectId });
    mockScreenshotCreate.mockResolvedValue({ id: screenshotId });

    await createScreenshot(featureId, {
      storagePath,
      altText: "Screenshot",
      displayOrder: 0,
    });

    expect(mockAssertScreenshotStorageObject).toHaveBeenCalledWith(storagePath);
    expect(mockScreenshotCreate).toHaveBeenCalledWith({
      data: {
        featureId,
        storagePath,
        altText: "Screenshot",
        displayOrder: 0,
      },
    });
  });

  it("rejects a path outside the target feature before checking Storage", async () => {
    mockFeatureFindUnique.mockResolvedValue({ projectId });

    await expect(
      createScreenshot(featureId, {
        storagePath: `projects/${projectId}/features/other/screenshot.webp`,
        altText: "Screenshot",
        displayOrder: 0,
      })
    ).rejects.toThrow("does not belong to this feature");

    expect(mockAssertScreenshotStorageObject).not.toHaveBeenCalled();
    expect(mockScreenshotCreate).not.toHaveBeenCalled();
  });

  it("deletes one storage object before deleting its screenshot record", async () => {
    mockScreenshotFindUnique.mockResolvedValue({ storagePath });

    await deleteScreenshot(screenshotId);

    expect(mockDeleteScreenshotStorageObjects).toHaveBeenCalledWith([storagePath]);
    expect(mockScreenshotDelete).toHaveBeenCalledWith({
      where: { id: screenshotId },
    });
    expect(
      mockDeleteScreenshotStorageObjects.mock.invocationCallOrder[0]
    ).toBeLessThan(mockScreenshotDelete.mock.invocationCallOrder[0]);
  });

  it("keeps the screenshot record when storage cleanup fails", async () => {
    mockScreenshotFindUnique.mockResolvedValue({ storagePath });
    mockDeleteScreenshotStorageObjects.mockRejectedValue(
      new Error("Screenshot storage cleanup failed.")
    );

    await expect(deleteScreenshot(screenshotId)).rejects.toThrow(
      "Screenshot storage cleanup failed."
    );

    expect(mockScreenshotDelete).not.toHaveBeenCalled();
  });

  it("deletes a legacy screenshot record without attempting Storage cleanup", async () => {
    mockScreenshotFindUnique.mockResolvedValue({ storagePath: null });

    await deleteScreenshot(screenshotId);

    expect(mockDeleteScreenshotStorageObjects).not.toHaveBeenCalled();
    expect(mockScreenshotDelete).toHaveBeenCalledWith({
      where: { id: screenshotId },
    });
  });

  it("removes feature screenshot objects before the cascading feature deletion", async () => {
    mockFeatureFindUnique.mockResolvedValue({
      screenshots: [{ storagePath }],
    });

    await deleteFeature(featureId);

    expect(mockDeleteScreenshotStorageObjects).toHaveBeenCalledWith([storagePath]);
    expect(mockFeatureDelete).toHaveBeenCalledWith({ where: { id: featureId } });
    expect(
      mockDeleteScreenshotStorageObjects.mock.invocationCallOrder[0]
    ).toBeLessThan(mockFeatureDelete.mock.invocationCallOrder[0]);
  });

  it("removes nested project screenshot objects before the cascading project deletion", async () => {
    mockProjectFindUnique.mockResolvedValue({
      features: [{ screenshots: [{ storagePath }] }],
    });

    await deleteProject(projectId);

    expect(mockDeleteScreenshotStorageObjects).toHaveBeenCalledWith([storagePath]);
    expect(mockProjectDelete).toHaveBeenCalledWith({ where: { id: projectId } });
    expect(
      mockDeleteScreenshotStorageObjects.mock.invocationCallOrder[0]
    ).toBeLessThan(mockProjectDelete.mock.invocationCallOrder[0]);
  });
});
