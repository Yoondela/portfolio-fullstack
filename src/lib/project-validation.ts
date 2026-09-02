import { z } from "zod";

// URLs are rendered as public links, so restrict them to navigable web protocols.
const webUrlSchema = z
  .string()
  .url()
  .refine(
    (value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    },
    "URL must use http or https"
  )
  .optional()
  .or(z.literal(""));

export const createProjectInputSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255),
  description: z.string().min(1, "Description is required"),
  note: z.string().trim().max(400, "Note must be 400 characters or fewer").optional(),
  technologies: z.array(z.string()).default([]),
  websiteUrl: webUrlSchema,
  githubUrl: webUrlSchema,
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
    note: z.string().trim().max(400, "Note must be 400 characters or fewer"),
    technologies: z.array(z.string()),
    websiteUrl: webUrlSchema,
    githubUrl: webUrlSchema,
    displayOrder: z.number().int().nonnegative(),
    published: z.boolean(),
  })
  .partial();

export type UpdateProjectInput = z.input<typeof updateProjectInputSchema>;
