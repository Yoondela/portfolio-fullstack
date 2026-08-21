import { afterEach, describe, expect, it, vi } from "vitest";

const { mockFindUnique, mockVerifyPassword } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockVerifyPassword: vi.fn(),
}));

// Isolate validation and credential decisions from database and hashing I/O.
vi.mock("../password", () => ({ verifyPassword: mockVerifyPassword }));
vi.mock("../../prisma", () => ({
  prisma: { user: { findUnique: mockFindUnique } },
}));

import { authorizeCredentials } from "../credentials";

describe("credentials authorization", () => {
  afterEach(() => {
    // Keep each outcome independent of the previous test's mocked result.
    mockFindUnique.mockReset();
    mockVerifyPassword.mockReset();
  });

  it("rejects invalid credentials", async () => {
    await expect(
      authorizeCredentials({ email: "not-an-email", password: "password" })
    ).resolves.toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a wrong password", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-id",
      email: "admin@example.com",
      passwordHash: "hash",
    });
    mockVerifyPassword.mockResolvedValue(false);

    await expect(
      authorizeCredentials({ email: "admin@example.com", password: "wrong-password" })
    ).resolves.toBeNull();
  });

  it("accepts valid credentials", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-id",
      email: "admin@example.com",
      passwordHash: "hash",
    });
    mockVerifyPassword.mockResolvedValue(true);

    await expect(
      authorizeCredentials({ email: "admin@example.com", password: "password" })
    ).resolves.toEqual({ id: "user-id", email: "admin@example.com" });
  });
});
