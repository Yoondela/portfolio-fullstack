import "server-only";

import { prisma } from "./prisma";

/** Deletes a feature and its screenshots through the database cascade. */
export async function deleteFeature(featureId: string): Promise<void> {
  await prisma.feature.delete({ where: { id: featureId } });
}
