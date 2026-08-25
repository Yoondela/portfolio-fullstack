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

  it("renders the shared navigation, signed-out avatar, and footer for guests", async () => {
    mockAuth.mockResolvedValue(null);

    const markup = await renderLayout(<p>Public content</p>);

    expect(markup).toContain("Public content");
    expect(markup).toContain('href="/engineering"');
    expect(markup).toContain('href="/contact"');
    expect(markup).toContain('aria-label="Account menu"');
    expect(markup).toContain("Y");
    expect(markup).not.toContain('href="/manage/projects"');
    expect(markup).toContain("Selected engineering work.");
  });

  it("renders the signed-in avatar while retaining the shared shell", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@example.com" } });

    const markup = await renderLayout(<p>Private content</p>);

    expect(markup).toContain("Private content");
    expect(markup).toContain('aria-label="Account menu"');
    expect(markup).toContain('href="/manage/projects"');
    expect(markup).toContain("Selected engineering work.");
  });
});
