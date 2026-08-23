import { afterEach, describe, expect, it, vi } from "vitest";

const { mockRequireAdmin } = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
}));

vi.mock("@/lib/auth/authorization", () => ({ requireAdmin: mockRequireAdmin }));

import NewProjectPage from "../page";

describe("NewProjectPage", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("rejects unauthenticated visitors before rendering the form", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Unauthorized"));

    await expect(NewProjectPage()).rejects.toThrow("Unauthorized");
  });
});
