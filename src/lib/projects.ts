import "server-only";

import { prisma } from "./prisma";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "./project-validation";
import type { Project } from "@/generated/prisma/client";

export async function getPublishedProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Returns every project for the authorized management interface.
 * Callers must enforce server-side admin authorization before using this read.
 */
export async function getProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: { displayOrder: "asc" },
  });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { id },
  });
}

export async function createProject(
  input: CreateProjectInput
): Promise<Project> {
  const validated = createProjectInputSchema.parse(input);

  return prisma.project.create({
    data: {
      name: validated.name,
      description: validated.description,
      technologies: validated.technologies,
      websiteUrl: validated.websiteUrl || null,
      githubUrl: validated.githubUrl || null,
      displayOrder: validated.displayOrder,
      published: validated.published,
    },
  });
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<Project> {
  const validated = updateProjectInputSchema.parse(input);

  return prisma.project.update({
    where: { id },
    data: {
      ...(validated.name !== undefined && { name: validated.name }),
      ...(validated.description !== undefined && {
        description: validated.description,
      }),
      ...(validated.technologies !== undefined && {
        technologies: validated.technologies,
      }),
      ...(validated.websiteUrl !== undefined && {
        websiteUrl: validated.websiteUrl || null,
      }),
      ...(validated.githubUrl !== undefined && {
        githubUrl: validated.githubUrl || null,
      }),
      ...(validated.displayOrder !== undefined && {
        displayOrder: validated.displayOrder,
      }),
      ...(validated.published !== undefined && {
        published: validated.published,
      }),
    },
  });
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({
    where: { id },
  });
}
