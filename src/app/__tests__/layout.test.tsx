import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockAuth } = vi.hoisted(() => ({ mockAuth: vi.fn() }));

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

import RootLayout from "../layout";

describe("RootLayout", () => {
  afterEach(() => {
    mockAuth.mockReset();
  });

  async function renderLayout(children: ReactNode) {
    return renderToStaticMarkup(
      await RootLayout({ children, params: Promise.resolve({}) })
    );
  }

  it("renders shared navigation and the footer without exposing Manage to guests", async () => {
    mockAuth.mockResolvedValue(null);

    const markup = await renderLayout(<p>Public content</p>);

    expect(markup).toContain("Public content");
    expect(markup).toContain('href="/engineering"');
    expect(markup).toContain('href="/contact"');
    expect(markup).not.toContain('href="/manage"');
    expect(markup).toContain("Selected engineering work.");
  });

  it("shows Manage while retaining the shared shell for signed-in users", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@example.com" } });

    const markup = await renderLayout(<p>Private content</p>);

    expect(markup).toContain("Private content");
    expect(markup).toContain('href="/manage"');
    expect(markup).toContain("Selected engineering work.");
  });
});
