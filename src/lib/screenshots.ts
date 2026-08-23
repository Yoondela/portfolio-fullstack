import "server-only";

import { prisma } from "./prisma";
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

  return prisma.screenshot.create({
    data: {
      featureId,
      url: validated.url,
      altText: validated.altText,
      displayOrder: validated.displayOrder,
    },
  });
}
