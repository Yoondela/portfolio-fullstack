"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/authorization";
import {
  createProject as createProjectRecord,
  deleteProject as deleteProjectRecord,
  updateProject as updateProjectRecord,
} from "@/lib/projects";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
} from "@/lib/project-validation";

export type ProjectActionResult =
  | { success: true }
  | { success: false; error: string };

export const initialProjectActionState: ProjectActionResult = {
  success: false,
  error: "",
};

const projectIdSchema = z.string().uuid();

/**
 * Converts browser form values to the application's typed project input.
 * The project schemas remain the validation boundary before any database write.
 */
function projectInputFromFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    technologies: formData.getAll("technologies").filter((value) => value !== ""),
    websiteUrl: formData.get("websiteUrl") ?? "",
    githubUrl: formData.get("githubUrl") ?? "",
    displayOrder: Number(formData.get("displayOrder")),
  };
}

/**
 * Reads only submitted fields for partial updates. Unlike creation, omitted
 * form fields must not be converted to defaults that overwrite stored data.
 */
function updateProjectInputFromFormData(formData: FormData) {
  const input: Record<string, unknown> = {};

  if (formData.has("name")) input.name = formData.get("name");
  if (formData.has("description")) {
    input.description = formData.get("description");
  }
  if (formData.has("technologies")) {
    input.technologies = formData
      .getAll("technologies")
      .filter((value) => value !== "");
  }
  if (formData.has("websiteUrl")) {
    input.websiteUrl = formData.get("websiteUrl");
  }
  if (formData.has("githubUrl")) {
    input.githubUrl = formData.get("githubUrl");
  }
  if (formData.has("displayOrder")) {
    input.displayOrder = Number(formData.get("displayOrder"));
  }
  return input;
}

function revalidateProjectViews(projectId?: string) {
  revalidatePath("/");
  revalidatePath("/manage/projects");
  if (projectId) revalidatePath(`/manage/projects/${projectId}`);
}

/**
 * Creates a draft project from an administrative form submission.
 * The first argument supports React's useActionState validation feedback.
 */
export async function createProjectAction(
  _previousState: ProjectActionResult,
  formData: FormData
): Promise<ProjectActionResult> {
  await requireAdmin();

  const input = createProjectInputSchema.safeParse(
    projectInputFromFormData(formData)
  );
  if (!input.success) return { success: false, error: "Invalid project data." };

  await createProjectRecord({ ...input.data, published: false });
  revalidateProjectViews();

  return { success: true };
}

/**
 * Updates editable project fields from an administrative form submission.
 * The first argument after the project ID supports React's useActionState.
 */
export async function updateProjectAction(
  projectId: string,
  _previousState: ProjectActionResult,
  formData: FormData
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(projectId).success) {
    return { success: false, error: "Invalid project ID." };
  }

  const input = updateProjectInputSchema.safeParse(
    updateProjectInputFromFormData(formData)
  );
  if (!input.success || Object.keys(input.data).length === 0) {
    return { success: false, error: "Invalid project data." };
  }

  await updateProjectRecord(projectId, input.data);
  revalidateProjectViews(projectId);

  return { success: true };
}

/** Deletes a project after validating its client-supplied identifier. */
export async function deleteProjectAction(
  projectId: string
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(projectId).success) {
    return { success: false, error: "Invalid project ID." };
  }

  await deleteProjectRecord(projectId);
  revalidateProjectViews();

  return { success: true };
}
