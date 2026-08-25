import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockRedirect, mockRequireAdmin } = vi.hoisted(() => ({
  mockRedirect: vi.fn(),
  mockRequireAdmin: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("@/lib/auth/authorization", () => ({
  requireAdmin: mockRequireAdmin,
}));

import ManageLayout from "../layout";

describe("ManageLayout", () => {
  afterEach(() => {
    mockRedirect.mockReset();
    mockRequireAdmin.mockReset();
  });

  it.each(["Unauthorized", "Forbidden"])(
    "redirects when authorization fails with %s",
    async (message) => {
      mockRequireAdmin.mockRejectedValue(new Error(message));
      mockRedirect.mockImplementation(() => {
        throw new Error("NEXT_REDIRECT");
      });

      await expect(
        ManageLayout({ children: <p>Private content</p> })
      ).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith(
        "/api/auth/signin?callbackUrl=%2Fmanage"
      );
    }
  );

  it("renders nested private content for an authorized administrator", async () => {
    mockRequireAdmin.mockResolvedValue({
      id: "admin-id",
      email: "admin@example.com",
      isAdmin: true,
    });

    const markup = renderToStaticMarkup(
      await ManageLayout({ children: <p>Private content</p> })
    );

    expect(markup).toContain("Private content");
  });
});
