import { z } from "zod";

/** Validates the editable fields for a feature attached to a project. */
export const featureInputSchema = z.object({
  name: z.string().min(1, "Feature name is required").max(255),
  description: z.string().min(1, "Feature description is required"),
  displayOrder: z.number().int().nonnegative(),
});

export type FeatureInput = z.input<typeof featureInputSchema>;

export const projectFeatureInputSchema = featureInputSchema.extend({
  id: z.string().uuid().optional(),
});

export type ProjectFeatureInput = z.input<typeof projectFeatureInputSchema>;
