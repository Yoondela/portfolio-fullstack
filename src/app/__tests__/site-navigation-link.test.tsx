// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockUsePathname } = vi.hoisted(() => ({ mockUsePathname: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname: mockUsePathname }));

import { SiteNavigationLink } from "../site-navigation-link";

describe("SiteNavigationLink", () => {
  afterEach(() => {
    cleanup();
    mockUsePathname.mockReset();
  });

  it("underlines and identifies the link for the current page", () => {
    mockUsePathname.mockReturnValue("/engineering");

    render(<SiteNavigationLink href="/engineering">Engineering</SiteNavigationLink>);

    const link = screen.getByRole("link", { name: "Engineering" });
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.className).toContain("underline");
  });

  it("keeps nested routes active while leaving other links unmarked", () => {
    mockUsePathname.mockReturnValue("/manage/projects/new");

    const { rerender } = render(
      <SiteNavigationLink href="/manage/projects">Manage projects</SiteNavigationLink>
    );
    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("page");

    rerender(<SiteNavigationLink href="/contact">Contact</SiteNavigationLink>);
    expect(screen.getByRole("link").getAttribute("aria-current")).toBeNull();
  });
});
