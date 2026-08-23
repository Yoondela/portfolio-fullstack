import { afterEach, describe, expect, it, vi } from "vitest";

const {
  mockCreateProject,
  mockDeleteProject,
  mockRedirect,
  mockRequireAdmin,
  mockRevalidatePath,
  mockUpdateProject,
} = vi.hoisted(() => ({
  mockCreateProject: vi.fn(),
  mockDeleteProject: vi.fn(),
  mockRedirect: vi.fn(),
  mockRequireAdmin: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockUpdateProject: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("@/lib/auth/authorization", () => ({ requireAdmin: mockRequireAdmin }));
vi.mock("@/lib/projects", () => ({
  createProject: mockCreateProject,
  deleteProject: mockDeleteProject,
  updateProject: mockUpdateProject,
}));

import {
  createProjectAction,
  deleteProjectAction,
  setProjectPublishedAction,
  updateProjectAction,
} from "../actions";
import { initialProjectActionState } from "../action-state";

const projectId = "11111111-1111-4111-8111-111111111111";

function validProjectFormData() {
  const formData = new FormData();
  formData.set("name", "Test project");
  formData.set("description", "A test project.");
  formData.append("technologies", "TypeScript");
  formData.append("technologies", "Next.js");
  formData.set("displayOrder", "1");
  formData.set("published", "true");
  return formData;
}

describe("project Server Actions", () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockRequireAdmin.mockResolvedValue({ id: "admin-id" });
  });

  it("rejects unauthenticated users before creating a project", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Unauthorized"));

    await expect(
      createProjectAction(initialProjectActionState, validProjectFormData())
    ).rejects.toThrow("Unauthorized");
    expect(mockCreateProject).not.toHaveBeenCalled();
  });

  it("rejects non-admin users before updating a project", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(
      updateProjectAction(
        projectId,
        initialProjectActionState,
        validProjectFormData()
      )
    ).rejects.toThrow("Forbidden");
    expect(mockUpdateProject).not.toHaveBeenCalled();
  });

  it("rejects invalid project input before writing", async () => {
    const formData = validProjectFormData();
    formData.set("displayOrder", "not-a-number");

    await expect(
      createProjectAction(initialProjectActionState, formData)
    ).resolves.toEqual({ success: false, error: "Invalid project data." });
    expect(mockCreateProject).not.toHaveBeenCalled();
  });

  it("creates a draft even when published=true is submitted", async () => {
    mockCreateProject.mockResolvedValue({ id: projectId });

    await expect(
      createProjectAction(initialProjectActionState, validProjectFormData())
    ).resolves.toEqual({ success: true });

    expect(mockCreateProject).toHaveBeenCalledWith({
      name: "Test project",
      description: "A test project.",
      technologies: ["TypeScript", "Next.js"],
      websiteUrl: "",
      githubUrl: "",
      displayOrder: 1,
      published: false,
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/manage/projects");
  });

  it("updates project fields while ignoring a submitted published value", async () => {
    mockUpdateProject.mockResolvedValue({ id: projectId });

    await expect(
      updateProjectAction(
        projectId,
        initialProjectActionState,
        validProjectFormData()
      )
    ).resolves.toEqual({ success: true });

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, {
      name: "Test project",
      description: "A test project.",
      technologies: ["TypeScript", "Next.js"],
      displayOrder: 1,
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/manage/projects/${projectId}`);
  });

  it("updates only the submitted fields", async () => {
    const formData = new FormData();
    formData.set("description", "An updated description.");

    await expect(
      updateProjectAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({ success: true });

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, {
      description: "An updated description.",
    });
  });

  it("removes all technologies when only an empty value is submitted", async () => {
    const formData = new FormData();
    formData.append("technologies", "");

    await expect(
      updateProjectAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({ success: true });

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, {
      technologies: [],
    });
  });

  it("rejects an update with only a published value", async () => {
    const formData = new FormData();
    formData.set("published", "true");

    await expect(
      updateProjectAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({
      success: false,
      error: "Invalid project data.",
    });
    expect(mockUpdateProject).not.toHaveBeenCalled();
  });

  it("rejects an update with no submitted fields", async () => {
    await expect(
      updateProjectAction(projectId, initialProjectActionState, new FormData())
    ).resolves.toEqual({ success: false, error: "Invalid project data." });
    expect(mockUpdateProject).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects unauthorized users before changing publication", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(
      setProjectPublishedAction(projectId, true)
    ).rejects.toThrow("Forbidden");

    expect(mockUpdateProject).not.toHaveBeenCalled();
  });

  it("rejects an invalid project ID before changing publication", async () => {
    await expect(
      setProjectPublishedAction("not-a-uuid", true)
    ).rejects.toThrow("Invalid project ID.");

    expect(mockUpdateProject).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects an invalid publication state before updating", async () => {
    await expect(
      setProjectPublishedAction(projectId, "true" as unknown as boolean)
    ).rejects.toThrow("Invalid publication state.");

    expect(mockUpdateProject).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    ["publishes", true],
    ["unpublishes", false],
  ])("%s a project and revalidates affected views", async (_, published) => {
    await setProjectPublishedAction(projectId, published);

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, { published });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/manage/projects");
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/manage/projects/${projectId}`);
  });

  it("rejects an invalid project ID before deleting", async () => {
    await expect(deleteProjectAction("not-a-uuid")).rejects.toThrow(
      "Invalid project ID."
    );
    expect(mockDeleteProject).not.toHaveBeenCalled();
  });

  it("rejects unauthorized users before deleting a project", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Unauthorized"));

    await expect(deleteProjectAction(projectId)).rejects.toThrow("Unauthorized");

    expect(mockDeleteProject).not.toHaveBeenCalled();
  });

  it("deletes a project, revalidates the list, and redirects", async () => {
    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(deleteProjectAction(projectId)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockDeleteProject).toHaveBeenCalledWith(projectId);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/manage/projects");
    expect(mockRedirect).toHaveBeenCalledWith("/manage/projects");
  });
});
