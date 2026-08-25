import "server-only";

import { randomUUID } from "node:crypto";
import { prisma } from "./prisma";
import {
  screenshotStoragePathSchema,
  screenshotUploadMetadataSchema,
  type ScreenshotUploadMetadata,
} from "./screenshot-validation";
import {
  createSignedScreenshotUploadUrl,
  deleteScreenshotStorageObjects,
} from "./supabase-storage";

const extensionsByContentType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

async function getFeatureProjectId(featureId: string): Promise<string> {
  const feature = await prisma.feature.findUnique({
    where: { id: featureId },
    select: { projectId: true },
  });

  if (!feature) {
    throw new Error("Feature not found.");
  }

  return feature.projectId;
}

/** Prepares a feature-owned object path and its short-lived upload capability. */
export async function createScreenshotUploadUrl(
  featureId: string,
  metadata: ScreenshotUploadMetadata
): Promise<{ storagePath: string; signedUrl: string; token: string }> {
  const validated = screenshotUploadMetadataSchema.parse(metadata);
  const projectId = await getFeatureProjectId(featureId);

  const extension = extensionsByContentType[validated.contentType];
  const storagePath = `projects/${projectId}/features/${featureId}/${randomUUID()}.${extension}`;
  const upload = await createSignedScreenshotUploadUrl(storagePath);

  return { storagePath, ...upload };
}

/** Removes an unfinalized upload after confirming that it belongs to the feature. */
export async function deletePendingScreenshotUpload(
  featureId: string,
  storagePath: string
): Promise<void> {
  const validatedPath = screenshotStoragePathSchema.parse(storagePath);
  const projectId = await getFeatureProjectId(featureId);
  const expectedPrefix = `projects/${projectId}/features/${featureId}/`;

  if (!validatedPath.startsWith(expectedPrefix)) {
    throw new Error("Screenshot storage path does not belong to this feature.");
  }

  const finalizedScreenshot = await prisma.screenshot.findUnique({
    where: { storagePath: validatedPath },
    select: { id: true },
  });
  if (finalizedScreenshot) return;

  await deleteScreenshotStorageObjects([validatedPath]);
}
