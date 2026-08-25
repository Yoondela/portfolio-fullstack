import "server-only";

import { prisma } from "./prisma";
import { deleteScreenshotStorageObjects } from "./supabase-storage";

/** Deletes a feature after removing all of its screenshot objects. */
export async function deleteFeature(featureId: string): Promise<void> {
  const feature = await prisma.feature.findUnique({
    where: { id: featureId },
    select: {
      screenshots: {
        select: { storagePath: true },
      },
    },
  });

  if (!feature) {
    throw new Error("Feature not found.");
  }

  await deleteScreenshotStorageObjects(
    feature.screenshots.flatMap((screenshot) =>
      screenshot.storagePath ? [screenshot.storagePath] : []
    )
  );
  await prisma.feature.delete({ where: { id: featureId } });
}
