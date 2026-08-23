import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockGetPublishedProjects } = vi.hoisted(() => ({
  mockGetPublishedProjects: vi.fn(),
}));

vi.mock("@/lib/projects", () => ({
  getPublishedProjects: mockGetPublishedProjects,
}));

import Home from "../page";

describe("Home", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("reads and renders published projects", async () => {
    mockGetPublishedProjects.mockResolvedValue([
      {
        id: "11111111-1111-4111-8111-111111111111",
        name: "Published project",
        description: "A public project.",
        technologies: ["TypeScript"],
        websiteUrl: "https://example.com",
        githubUrl: "https://github.com/example/project",
        displayOrder: 1,
        published: true,
      },
    ]);

    const page = await Home();
    const markup = renderToStaticMarkup(page);

    expect(mockGetPublishedProjects).toHaveBeenCalledOnce();
    expect(markup).toContain("Published project");
    expect(markup).toContain("A public project.");
    expect(markup).toContain("TypeScript");
    expect(markup).toContain('href="https://example.com"');
    expect(markup).toContain('href="https://github.com/example/project"');
  });

  it("shows an empty state when no projects are published", async () => {
    mockGetPublishedProjects.mockResolvedValue([]);

    const page = await Home();
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("No projects published yet.");
  });

  it("does not render unsafe stored URLs as links", async () => {
    mockGetPublishedProjects.mockResolvedValue([
      {
        id: "11111111-1111-4111-8111-111111111111",
        name: "Legacy project",
        description: "Contains URLs saved before protocol validation.",
        technologies: [],
        websiteUrl: "javascript:alert(1)",
        githubUrl: "javascript:alert(2)",
        displayOrder: 1,
        published: true,
      },
    ]);

    const page = await Home();
    const markup = renderToStaticMarkup(page);

    expect(markup).not.toContain("javascript:");
    expect(markup).not.toContain("href=");
  });
});
