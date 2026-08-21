import { afterEach, describe, expect, it, vi } from "vitest";

const { mockAuth, mockFindUnique } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockFindUnique: vi.fn(),
}));

// Exercise authorization decisions without depending on an Auth.js request.
vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("../../prisma", () => ({
  prisma: { user: { findUnique: mockFindUnique } },
}));

import { requireAdmin } from "../authorization";

describe("requireAdmin", () => {
  afterEach(() => {
    mockAuth.mockReset();
    mockFindUnique.mockReset();
  });

  it("rejects unauthenticated users", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow("Unauthorized");
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("rejects non-admin users", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    mockFindUnique.mockResolvedValue({ isAdmin: false });

    await expect(requireAdmin()).rejects.toThrow("Forbidden");
  });

  it("allows administrators", async () => {
    const admin = {
      id: "admin-id",
      email: "admin@example.com",
      isAdmin: true,
    };
    mockAuth.mockResolvedValue({ user: { email: admin.email } });
    mockFindUnique.mockResolvedValue(admin);

    await expect(requireAdmin()).resolves.toEqual(admin);
  });
});
