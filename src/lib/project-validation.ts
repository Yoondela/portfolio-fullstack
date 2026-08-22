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

// Update inputs must not inherit creation defaults: an omitted field means
// "leave the stored value unchanged", not "replace it with a default".
export const updateProjectInputSchema = z
  .object({
    name: z.string().min(1, "Project name is required").max(255),
    description: z.string().min(1, "Description is required"),
    technologies: z.array(z.string()),
    websiteUrl: z.string().url().optional().or(z.literal("")),
    githubUrl: z.string().url().optional().or(z.literal("")),
    displayOrder: z.number().int().nonnegative(),
    published: z.boolean(),
  })
  .partial();

export type UpdateProjectInput = z.input<typeof updateProjectInputSchema>;
