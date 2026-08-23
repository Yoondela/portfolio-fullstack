import "server-only";

import { prisma } from "./prisma";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "./project-validation";
import {
  featureInputSchema,
  projectFeatureInputSchema,
  type FeatureInput,
  type ProjectFeatureInput,
} from "./feature-validation";
import type { Feature, Project, Screenshot } from "@/generated/prisma/client";

type FeatureWithScreenshots = Feature & { screenshots: Screenshot[] };
type ProjectWithFeatures = Project & { features: FeatureWithScreenshots[] };

/** Returns public projects with their features in configured display order. */
export async function getPublishedProjects(): Promise<ProjectWithFeatures[]> {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { displayOrder: "asc" },
    include: {
      features: {
        orderBy: { displayOrder: "asc" },
        include: {
          screenshots: {
            orderBy: { displayOrder: "asc" },
          },
        },
      },
    },
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

export async function getProjectById(
  id: string
): Promise<ProjectWithFeatures | null> {
  return prisma.project.findUnique({
    where: { id },
    include: {
      features: {
        orderBy: { displayOrder: "asc" },
        include: {
          screenshots: {
            orderBy: { displayOrder: "asc" },
          },
        },
      },
    },
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

/** Creates a project and its validated initial features in one database write. */
export async function createProjectWithFeatures(
  input: CreateProjectInput,
  features: FeatureInput[]
): Promise<Project> {
  const validated = createProjectInputSchema.parse(input);
  const validatedFeatures = featureInputSchema.array().parse(features);

  return prisma.project.create({
    data: {
      name: validated.name,
      description: validated.description,
      technologies: validated.technologies,
      websiteUrl: validated.websiteUrl || null,
      githubUrl: validated.githubUrl || null,
      displayOrder: validated.displayOrder,
      published: validated.published,
      features: {
        create: validatedFeatures,
      },
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

/** Updates project fields and adds or edits its submitted feature records. */
export async function updateProjectWithFeatures(
  id: string,
  input: UpdateProjectInput,
  features: ProjectFeatureInput[]
): Promise<Project> {
  const validated = updateProjectInputSchema.parse(input);
  const validatedFeatures = projectFeatureInputSchema.array().parse(features);

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
      features: {
        create: validatedFeatures
          .filter((feature) => feature.id === undefined)
          .map((feature) => ({
            name: feature.name,
            description: feature.description,
            displayOrder: feature.displayOrder,
          })),
        update: validatedFeatures
          .filter((feature) => feature.id !== undefined)
          .map((feature) => ({
            where: { id: feature.id! },
            data: {
              name: feature.name,
              description: feature.description,
              displayOrder: feature.displayOrder,
            },
          })),
      },
    },
  });
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({
    where: { id },
  });
}
