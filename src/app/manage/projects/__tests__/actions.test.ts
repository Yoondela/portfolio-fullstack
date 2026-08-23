import { afterEach, describe, expect, it, vi } from "vitest";

const {
  mockCreateProject,
  mockDeleteProject,
  mockRequireAdmin,
  mockRevalidatePath,
  mockUpdateProject,
} = vi.hoisted(() => ({
  mockCreateProject: vi.fn(),
  mockDeleteProject: vi.fn(),
  mockRequireAdmin: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockUpdateProject: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@/lib/auth/authorization", () => ({ requireAdmin: mockRequireAdmin }));
vi.mock("@/lib/projects", () => ({
  createProject: mockCreateProject,
  deleteProject: mockDeleteProject,
  updateProject: mockUpdateProject,
}));

import {
  createProjectAction,
  deleteProjectAction,
  initialProjectActionState,
  updateProjectAction,
} from "../actions";

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
      updateProjectAction(projectId, validProjectFormData())
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

  it("updates a project, including its published state", async () => {
    mockUpdateProject.mockResolvedValue({ id: projectId });

    await expect(
      updateProjectAction(projectId, validProjectFormData())
    ).resolves.toEqual({ success: true });

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, {
      name: "Test project",
      description: "A test project.",
      technologies: ["TypeScript", "Next.js"],
      displayOrder: 1,
      published: true,
    });
  });

  it("updates only the submitted fields", async () => {
    const formData = new FormData();
    formData.set("description", "An updated description.");

    await expect(updateProjectAction(projectId, formData)).resolves.toEqual({
      success: true,
    });

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, {
      description: "An updated description.",
    });
  });

  it.each([
    ["publishes", "true", true],
    ["unpublishes", "false", false],
  ])("%s a project when only published is submitted", async (_, value, expected) => {
    const formData = new FormData();
    formData.set("published", value);

    await expect(updateProjectAction(projectId, formData)).resolves.toEqual({
      success: true,
    });

    expect(mockUpdateProject).toHaveBeenCalledWith(projectId, {
      published: expected,
    });
  });

  it("rejects an unsupported published value before updating", async () => {
    const formData = new FormData();
    formData.set("published", "unexpected");

    await expect(updateProjectAction(projectId, formData)).resolves.toEqual({
      success: false,
      error: "Invalid project data.",
    });
    expect(mockUpdateProject).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects an update with no submitted fields", async () => {
    await expect(updateProjectAction(projectId, new FormData())).resolves.toEqual(
      {
        success: false,
        error: "Invalid project data.",
      }
    );
    expect(mockUpdateProject).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects an invalid project ID before deleting", async () => {
    await expect(deleteProjectAction("not-a-uuid")).resolves.toEqual({
      success: false,
      error: "Invalid project ID.",
    });
    expect(mockDeleteProject).not.toHaveBeenCalled();
  });

  it("deletes a project and revalidates project views", async () => {
    await expect(deleteProjectAction(projectId)).resolves.toEqual({
      success: true,
    });

    expect(mockDeleteProject).toHaveBeenCalledWith(projectId);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/manage/projects");
  });
});
