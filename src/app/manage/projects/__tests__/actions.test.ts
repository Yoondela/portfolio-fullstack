import { afterEach, describe, expect, it, vi } from "vitest";

const {
  mockCreateProject,
  mockCreateProjectWithFeatures,
  mockDeleteFeature,
  mockDeleteProject,
  mockDeleteScreenshot,
  mockRedirect,
  mockRequireAdmin,
  mockRevalidatePath,
  mockCreateScreenshot,
  mockUpdateProject,
  mockUpdateProjectWithFeatures,
} = vi.hoisted(() => ({
  mockCreateProject: vi.fn(),
  mockCreateProjectWithFeatures: vi.fn(),
  mockDeleteFeature: vi.fn(),
  mockDeleteProject: vi.fn(),
  mockDeleteScreenshot: vi.fn(),
  mockRedirect: vi.fn(),
  mockRequireAdmin: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockCreateScreenshot: vi.fn(),
  mockUpdateProject: vi.fn(),
  mockUpdateProjectWithFeatures: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("@/lib/auth/authorization", () => ({ requireAdmin: mockRequireAdmin }));
vi.mock("@/lib/projects", () => ({
  createProject: mockCreateProject,
  createProjectWithFeatures: mockCreateProjectWithFeatures,
  deleteProject: mockDeleteProject,
  updateProject: mockUpdateProject,
  updateProjectWithFeatures: mockUpdateProjectWithFeatures,
}));
vi.mock("@/lib/features", () => ({ deleteFeature: mockDeleteFeature }));
vi.mock("@/lib/screenshots", () => ({
  createScreenshot: mockCreateScreenshot,
  deleteScreenshot: mockDeleteScreenshot,
}));

import {
  createProjectAction,
  createScreenshotAction,
  deleteFeatureAction,
  deleteProjectAction,
  deleteScreenshotAction,
  setProjectPublishedAction,
  updateProjectAction,
} from "../actions";
import { initialProjectActionState } from "../action-state";
import { ScreenshotStorageVerificationError } from "@/lib/screenshot-storage-errors";

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

  it("creates submitted features with a new draft project", async () => {
    const formData = validProjectFormData();
    formData.append("featureIds", "");
    formData.append("featureNames", "Project feature");
    formData.append("featureDescriptions", "A feature description.");
    formData.append("featureDisplayOrders", "0");
    mockCreateProjectWithFeatures.mockResolvedValue({ id: projectId });

    await expect(
      createProjectAction(initialProjectActionState, formData)
    ).resolves.toEqual({ success: true });

    expect(mockCreateProjectWithFeatures).toHaveBeenCalledWith(
      {
        name: "Test project",
        description: "A test project.",
        technologies: ["TypeScript", "Next.js"],
        websiteUrl: "",
        githubUrl: "",
        displayOrder: 1,
        published: false,
      },
      [
        {
          name: "Project feature",
          description: "A feature description.",
          displayOrder: 0,
        },
      ]
    );
  });

  it("rejects invalid feature input before creating a project", async () => {
    const formData = validProjectFormData();
    formData.append("featureIds", "");
    formData.append("featureNames", "");
    formData.append("featureDescriptions", "Missing a feature name.");
    formData.append("featureDisplayOrders", "0");

    await expect(
      createProjectAction(initialProjectActionState, formData)
    ).resolves.toEqual({ success: false, error: "Invalid feature data." });

    expect(mockCreateProject).not.toHaveBeenCalled();
    expect(mockCreateProjectWithFeatures).not.toHaveBeenCalled();
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

  it("adds and edits submitted features with a project update", async () => {
    const formData = validProjectFormData();
    formData.append("featureIds", "22222222-2222-4222-8222-222222222222");
    formData.append("featureNames", "Updated feature");
    formData.append("featureDescriptions", "An updated feature description.");
    formData.append("featureDisplayOrders", "2");
    formData.append("featureIds", "");
    formData.append("featureNames", "New feature");
    formData.append("featureDescriptions", "A new feature description.");
    formData.append("featureDisplayOrders", "3");
    mockUpdateProjectWithFeatures.mockResolvedValue({ id: projectId });

    await expect(
      updateProjectAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({ success: true });

    expect(mockUpdateProjectWithFeatures).toHaveBeenCalledWith(
      projectId,
      {
        name: "Test project",
        description: "A test project.",
        technologies: ["TypeScript", "Next.js"],
        displayOrder: 1,
      },
      [
        {
          id: "22222222-2222-4222-8222-222222222222",
          name: "Updated feature",
          description: "An updated feature description.",
          displayOrder: 2,
        },
        {
          name: "New feature",
          description: "A new feature description.",
          displayOrder: 3,
        },
      ]
    );
  });

  it("creates a screenshot after admin authorization", async () => {
    const formData = new FormData();
    formData.set(
      "storagePath",
      "projects/project-id/features/feature-id/screenshot.png"
    );
    formData.set("altText", "Project screenshot");
    formData.set("displayOrder", "0");

    await expect(
      createScreenshotAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({ success: true });

    expect(mockCreateScreenshot).toHaveBeenCalledWith(projectId, {
      storagePath: "projects/project-id/features/feature-id/screenshot.png",
      altText: "Project screenshot",
      displayOrder: 0,
    });
  });

  it("rejects unauthorized users before creating a screenshot", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(
      createScreenshotAction(projectId, initialProjectActionState, new FormData())
    ).rejects.toThrow("Forbidden");

    expect(mockCreateScreenshot).not.toHaveBeenCalled();
  });

  it("returns an error when the screenshot storage object cannot be verified", async () => {
    const formData = new FormData();
    formData.set(
      "storagePath",
      "projects/project-id/features/feature-id/screenshot.png"
    );
    formData.set("altText", "Project screenshot");
    formData.set("displayOrder", "0");
    mockCreateScreenshot.mockRejectedValue(
      new ScreenshotStorageVerificationError("Storage unavailable")
    );

    await expect(
      createScreenshotAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({
      success: false,
      error: "Screenshot storage object could not be verified.",
    });
  });

  it("propagates unexpected screenshot creation failures", async () => {
    const formData = new FormData();
    formData.set(
      "storagePath",
      "projects/project-id/features/feature-id/screenshot.png"
    );
    formData.set("altText", "Project screenshot");
    formData.set("displayOrder", "0");
    mockCreateScreenshot.mockRejectedValue(new Error("Database unavailable"));

    await expect(
      createScreenshotAction(projectId, initialProjectActionState, formData)
    ).rejects.toThrow("Database unavailable");
  });

  it("rejects invalid screenshot input before writing", async () => {
    const formData = new FormData();
    formData.set("storagePath", "../screenshot.webp");
    formData.set("altText", "Unsafe screenshot");
    formData.set("displayOrder", "0");

    await expect(
      createScreenshotAction(projectId, initialProjectActionState, formData)
    ).resolves.toEqual({ success: false, error: "Invalid screenshot data." });

    expect(mockCreateScreenshot).not.toHaveBeenCalled();
  });

  it("rejects unauthorized users before deleting a feature", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(deleteFeatureAction(projectId)).rejects.toThrow("Forbidden");

    expect(mockDeleteFeature).not.toHaveBeenCalled();
  });

  it("deletes a feature and revalidates affected views", async () => {
    await deleteFeatureAction(projectId);

    expect(mockDeleteFeature).toHaveBeenCalledWith(projectId);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/manage/projects");
  });

  it("rejects unauthorized users before deleting a screenshot", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(deleteScreenshotAction(projectId)).rejects.toThrow("Forbidden");

    expect(mockDeleteScreenshot).not.toHaveBeenCalled();
  });

  it("deletes a screenshot and revalidates affected views", async () => {
    await deleteScreenshotAction(projectId);

    expect(mockDeleteScreenshot).toHaveBeenCalledWith(projectId);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/manage/projects");
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
