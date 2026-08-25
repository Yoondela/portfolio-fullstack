import "server-only";

import { prisma } from "./prisma";
import {
  assertScreenshotStorageObject,
  deleteScreenshotStorageObjects,
} from "./supabase-storage";
import {
  screenshotInputSchema,
  type ScreenshotInput,
} from "./screenshot-validation";
import type { Screenshot } from "@/generated/prisma/client";

/** Creates a validated screenshot record for an existing feature. */
export async function createScreenshot(
  featureId: string,
  input: ScreenshotInput
): Promise<Screenshot> {
  const validated = screenshotInputSchema.parse(input);
  const feature = await prisma.feature.findUnique({
    where: { id: featureId },
    select: { projectId: true },
  });

  if (!feature) {
    throw new Error("Feature not found.");
  }

  const expectedPrefix = `projects/${feature.projectId}/features/${featureId}/`;
  if (!validated.storagePath.startsWith(expectedPrefix)) {
    throw new Error("Screenshot storage path does not belong to this feature.");
  }

  await assertScreenshotStorageObject(validated.storagePath);

  return prisma.screenshot.create({
    data: {
      featureId,
      storagePath: validated.storagePath,
      altText: validated.altText,
      displayOrder: validated.displayOrder,
    },
  });
}

/** Deletes one screenshot from its feature. */
export async function deleteScreenshot(screenshotId: string): Promise<void> {
  const screenshot = await prisma.screenshot.findUnique({
    where: { id: screenshotId },
    select: { storagePath: true },
  });

  if (!screenshot) {
    throw new Error("Screenshot not found.");
  }

  if (screenshot.storagePath) {
    await deleteScreenshotStorageObjects([screenshot.storagePath]);
  }
  await prisma.screenshot.delete({ where: { id: screenshotId } });
}
