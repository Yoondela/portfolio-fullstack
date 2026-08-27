import { afterEach, describe, expect, it, vi } from "vitest";

const { mockCreateClient, mockExists, mockFrom } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockExists: vi.fn(),
  mockFrom: vi.fn(() => ({ exists: mockExists })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mockCreateClient.mockImplementation(() => ({
    storage: { from: mockFrom },
  })),
}));

import { ScreenshotStorageVerificationError } from "../screenshot-storage-errors";
import { assertScreenshotStorageObject } from "../supabase-storage";

const storagePath =
  "projects/project-id/features/feature-id/screenshot.webp";

describe("assertScreenshotStorageObject", () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockFrom.mockReturnValue({ exists: mockExists });
  });

  it("initializes Supabase only when a storage operation runs", async () => {
    expect(mockCreateClient).not.toHaveBeenCalled();

    mockExists.mockResolvedValue({ data: true, error: null });
    await assertScreenshotStorageObject(storagePath);

    expect(mockCreateClient).toHaveBeenCalledOnce();
  });

  it("checks the exact object path", async () => {
    mockExists.mockResolvedValue({ data: true, error: null });

    await expect(assertScreenshotStorageObject(storagePath)).resolves.toBeUndefined();

    expect(mockFrom).toHaveBeenCalledWith(
      process.env.SUPABASE_STORAGE_BUCKET
    );
    expect(mockExists).toHaveBeenCalledWith(storagePath);
  });

  it("rejects when the exact object is missing", async () => {
    mockExists.mockResolvedValue({ data: false, error: new Error("Not found") });

    await expect(assertScreenshotStorageObject(storagePath)).rejects.toBeInstanceOf(
      ScreenshotStorageVerificationError
    );
  });
});
