import { z } from "zod";

export const createProjectInputSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).default([]),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  displayOrder: z.number().int().nonnegative(),
  published: z.boolean().default(false),
});

export type CreateProjectInput = z.input<typeof createProjectInputSchema>;

export const updateProjectInputSchema = createProjectInputSchema.partial();

export type UpdateProjectInput = z.input<typeof updateProjectInputSchema>;
