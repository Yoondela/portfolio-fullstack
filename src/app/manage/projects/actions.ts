"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/authorization";
import {
  createProject as createProjectRecord,
  createProjectWithFeatures as createProjectWithFeaturesRecord,
  deleteProject as deleteProjectRecord,
  updateProject as updateProjectRecord,
  updateProjectWithFeatures as updateProjectWithFeaturesRecord,
} from "@/lib/projects";
import { projectFeatureInputSchema } from "@/lib/feature-validation";
import { deleteFeature as deleteFeatureRecord } from "@/lib/features";
import {
  createScreenshot as createScreenshotRecord,
  deleteScreenshot as deleteScreenshotRecord,
} from "@/lib/screenshots";
import { screenshotInputSchema } from "@/lib/screenshot-validation";
import { ScreenshotStorageVerificationError } from "@/lib/screenshot-storage-errors";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
} from "@/lib/project-validation";
import type { ProjectActionResult } from "./action-state";

const projectIdSchema = z.string().uuid();
const publishedSchema = z.boolean();

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

/** Converts the repeated feature fields emitted by the project forms. */
function featureInputsFromFormData(formData: FormData) {
  const ids = formData.getAll("featureIds");
  const names = formData.getAll("featureNames");
  const descriptions = formData.getAll("featureDescriptions");
  const displayOrders = formData.getAll("featureDisplayOrders");

  if (
    names.length === 0 &&
    descriptions.length === 0 &&
    displayOrders.length === 0
  ) {
    return [];
  }
  if (
    ids.length !== names.length ||
    names.length !== descriptions.length ||
    names.length !== displayOrders.length
  ) {
    return null;
  }

  return names.map((name, index) => ({
    id: ids[index] === "" ? undefined : ids[index],
    name,
    description: descriptions[index],
    displayOrder: Number(displayOrders[index]),
  }));
}

function revalidateProjectViews(projectId?: string) {
  revalidatePath("/");
  revalidatePath("/manage/projects");
  if (projectId) revalidatePath(`/manage/projects/${projectId}`);
}

/**
 * Creates a draft project and its optional initial features from an admin form.
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

  const featureRows = featureInputsFromFormData(formData);
  const features = projectFeatureInputSchema.array().safeParse(featureRows);
  if (!features.success) return { success: false, error: "Invalid feature data." };

  if (features.data.length > 0) {
    await createProjectWithFeaturesRecord(
      { ...input.data, published: false },
      features.data
    );
  } else {
    await createProjectRecord({ ...input.data, published: false });
  }
  revalidateProjectViews();

  return { success: true };
}

/**
 * Updates editable project fields and submitted feature additions or edits.
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

  const featureRows = featureInputsFromFormData(formData);
  const features = projectFeatureInputSchema.array().safeParse(featureRows);
  if (!features.success) return { success: false, error: "Invalid feature data." };

  if (formData.has("featureNames")) {
    await updateProjectWithFeaturesRecord(projectId, input.data, features.data);
  } else {
    await updateProjectRecord(projectId, input.data);
  }
  revalidateProjectViews(projectId);

  return { success: true };
}

/** Creates a screenshot record for an existing feature after admin authorization. */
export async function createScreenshotAction(
  featureId: string,
  _previousState: ProjectActionResult,
  formData: FormData
): Promise<ProjectActionResult> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(featureId).success) {
    return { success: false, error: "Invalid feature ID." };
  }

  const input = screenshotInputSchema.safeParse({
    storagePath: formData.get("storagePath"),
    altText: formData.get("altText"),
    displayOrder: Number(formData.get("displayOrder")),
  });
  if (!input.success) return { success: false, error: "Invalid screenshot data." };

  try {
    await createScreenshotRecord(featureId, input.data);
  } catch (error) {
    if (error instanceof ScreenshotStorageVerificationError) {
      return {
        success: false,
        error: "Screenshot storage object could not be verified.",
      };
    }

    throw error;
  }
  revalidateProjectViews();

  return { success: true };
}

/** Deletes a feature and its dependent screenshots after admin authorization. */
export async function deleteFeatureAction(featureId: string): Promise<void> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(featureId).success) {
    throw new Error("Invalid feature ID.");
  }

  await deleteFeatureRecord(featureId);
  revalidateProjectViews();
}

/** Deletes one screenshot after admin authorization. */
export async function deleteScreenshotAction(screenshotId: string): Promise<void> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(screenshotId).success) {
    throw new Error("Invalid screenshot ID.");
  }

  await deleteScreenshotRecord(screenshotId);
  revalidateProjectViews();
}

/** Changes only the publication state from the protected management view. */
export async function setProjectPublishedAction(
  projectId: string,
  published: boolean
): Promise<void> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(projectId).success) {
    throw new Error("Invalid project ID.");
  }
  if (!publishedSchema.safeParse(published).success) {
    throw new Error("Invalid publication state.");
  }

  await updateProjectRecord(projectId, { published });
  revalidateProjectViews(projectId);
}

/** Deletes a project and returns the administrator to the project list. */
export async function deleteProjectAction(
  projectId: string
): Promise<void> {
  await requireAdmin();

  if (!projectIdSchema.safeParse(projectId).success) {
    throw new Error("Invalid project ID.");
  }

  await deleteProjectRecord(projectId);
  revalidateProjectViews();
  redirect("/manage/projects");
}
