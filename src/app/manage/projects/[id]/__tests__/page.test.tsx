import { Children, isValidElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditProjectForm } from "../edit-project-form";

const { mockGetProjectById, mockRequireAdmin } = vi.hoisted(() => ({
  mockGetProjectById: vi.fn(),
  mockRequireAdmin: vi.fn(),
}));

vi.mock("@/lib/auth/authorization", () => ({ requireAdmin: mockRequireAdmin }));
vi.mock("@/lib/projects", () => ({ getProjectById: mockGetProjectById }));

import EditProjectPage from "../page";

describe("EditProjectPage", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("rejects unauthorized visitors before reading a project", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(
      EditProjectPage({
        params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" }),
      })
    ).rejects.toThrow("Forbidden");

    expect(mockGetProjectById).not.toHaveBeenCalled();
  });

  it("reads the project after authorization and passes it to the form", async () => {
    const projectId = "11111111-1111-4111-8111-111111111111";
    const project = {
      id: projectId,
      name: "Test project",
      description: "A test project.",
      technologies: ["TypeScript"],
      websiteUrl: null,
      githubUrl: null,
      displayOrder: 1,
      features: [],
    };
    mockRequireAdmin.mockResolvedValue({ id: "admin-id" });
    mockGetProjectById.mockResolvedValue(project);

    const page = await EditProjectPage({
      params: Promise.resolve({ id: projectId }),
    });
    const form = Children.toArray(page.props.children).find(
      (child) => isValidElement(child) && child.type === EditProjectForm
    );

    expect(mockGetProjectById).toHaveBeenCalledWith(projectId);
    if (!isValidElement<{ project: typeof project }>(form)) {
      throw new Error("Expected the edit form element");
    }
    expect(form.props.project).toEqual(project);
  });
});
