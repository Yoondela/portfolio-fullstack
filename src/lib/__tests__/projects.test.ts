import { describe, it, expect, afterAll, afterEach } from "vitest";
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjects,
  getPublishedProjects,
} from "../projects";
import { prisma } from "../prisma";

describe("Project CRUD Operations", () => {
  let testProjectId: string;

  afterEach(async () => {
    // Clean up any test projects after each test
    if (testProjectId) {
      try {
        const project = await getProjectById(testProjectId);
        if (project) {
          await deleteProject(testProjectId);
        }
      } catch {
        // Project already deleted or doesn't exist
      }
    }
  });

  afterAll(async () => {
    // Close database connection
    await prisma.$disconnect();
  });

  it("should create a project with default state", async () => {
    const project = await createProject({
      name: "Test Project",
      description: "Test description",
      technologies: ["TypeScript"],
      displayOrder: 1,
    });

    testProjectId = project.id;

    expect(project.name).toBe("Test Project");
    expect(project.description).toBe("Test description");
    expect(project.technologies).toEqual(["TypeScript"]);
    expect(project.displayOrder).toBe(1);
    expect(project.published).toBe(false);
    expect(project.websiteUrl).toBeNull();
    expect(project.githubUrl).toBeNull();
  });

  it("should retrieve a project by ID", async () => {
    const created = await createProject({
      name: "Retrieve Test",
      description: "For retrieval",
      displayOrder: 2,
    });
    testProjectId = created.id;

    const retrieved = await getProjectById(created.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(created.id);
    expect(retrieved!.name).toBe("Retrieve Test");
  });

  it("should return null for non-existent project", async () => {
    const retrieved = await getProjectById(
      "00000000-0000-0000-0000-000000000000"
    );
    expect(retrieved).toBeNull();
  });

  it("should update project fields", async () => {
    const created = await createProject({
      name: "Original Name",
      description: "Original",
      displayOrder: 3,
    });
    testProjectId = created.id;

    const updated = await updateProject(created.id, {
      name: "Updated Name",
      description: "Updated description",
      technologies: ["React", "Next.js"],
    });

    expect(updated.name).toBe("Updated Name");
    expect(updated.description).toBe("Updated description");
    expect(updated.technologies).toEqual(["React", "Next.js"]);
    expect(updated.displayOrder).toBe(3); // Unchanged
    expect(updated.published).toBe(false); // Unchanged
  });

  it("should publish a project", async () => {
    const created = await createProject({
      name: "To Publish",
      description: "Will be published",
      displayOrder: 4,
      published: false,
    });
    testProjectId = created.id;

    const published = await updateProject(created.id, { published: true });

    expect(published.published).toBe(true);
  });

  it("should delete a project", async () => {
    const created = await createProject({
      name: "To Delete",
      description: "Will be deleted",
      displayOrder: 5,
    });
    testProjectId = created.id;

    await deleteProject(created.id);

    const retrieved = await getProjectById(created.id);
    expect(retrieved).toBeNull();

    testProjectId = ""; // Clear ID since project is deleted
  });

  it("should exclude unpublished projects from getPublishedProjects", async () => {
    const unpublished = await createProject({
      name: "Unpublished Project",
      description: "Not published",
      displayOrder: 100,
      published: false,
    });
    testProjectId = unpublished.id;

    const published = await getPublishedProjects();

    const found = published.some((p) => p.id === unpublished.id);
    expect(found).toBe(false);
  });

  it("should include published and draft projects in getProjects", async () => {
    const published = await createProject({
      name: "Management Published",
      description: "Visible in management",
      displayOrder: 101,
      published: true,
    });
    const draft = await createProject({
      name: "Management Draft",
      description: "Visible in management",
      displayOrder: 102,
      published: false,
    });
    testProjectId = draft.id;

    try {
      const projects = await getProjects();
      const publishedIndex = projects.findIndex(
        (project) => project.id === published.id
      );
      const draftIndex = projects.findIndex(
        (project) => project.id === draft.id
      );

      expect(publishedIndex).not.toBe(-1);
      expect(draftIndex).not.toBe(-1);
      expect(publishedIndex).toBeLessThan(draftIndex);
    } finally {
      await deleteProject(published.id);
    }
  });

  it("should include published projects in getPublishedProjects", async () => {
    const created = await createProject({
      name: "Published Project",
      description: "Is published",
      displayOrder: 101,
      published: true,
    });
    testProjectId = created.id;

    const published = await getPublishedProjects();

    const found = published.find((p) => p.id === created.id);
    expect(found).not.toBeUndefined();
    expect(found!.name).toBe("Published Project");
  });

  it("should order published projects by displayOrder", async () => {
    const project1 = await createProject({
      name: "First Project",
      description: "Display order 10",
      displayOrder: 10,
      published: true,
    });

    const project2 = await createProject({
      name: "Second Project",
      description: "Display order 5",
      displayOrder: 5,
      published: true,
    });

    testProjectId = project1.id; // Clean up both
    try {
      const published = await getPublishedProjects();

      const indices = {
        proj1: published.findIndex((p) => p.id === project1.id),
        proj2: published.findIndex((p) => p.id === project2.id),
      };

      // Both projects should be found
      expect(indices.proj1).not.toBe(-1);
      expect(indices.proj2).not.toBe(-1);

      // Lower displayOrder should come first
      if (indices.proj2 !== -1 && indices.proj1 !== -1) {
        expect(indices.proj2).toBeLessThan(indices.proj1);
      }

      await deleteProject(project2.id);
    } finally {
      // Clean up
      const proj1 = await getProjectById(project1.id);
      if (proj1) await deleteProject(project1.id);
    }
  });

  it("should validate required fields on create", async () => {
    // @ts-expect-error - Testing validation with missing field
    const createInvalid = async () => createProject({ name: "Test" });

    await expect(createInvalid()).rejects.toThrow();
  });

  it("should accept URL fields as optional", async () => {
    const project = await createProject({
      name: "No URLs",
      description: "No URL fields provided",
      displayOrder: 6,
    });
    testProjectId = project.id;

    expect(project.websiteUrl).toBeNull();
    expect(project.githubUrl).toBeNull();
  });

  it("should accept valid URLs", async () => {
    const project = await createProject({
      name: "With URLs",
      description: "Has URLs",
      displayOrder: 7,
      websiteUrl: "https://example.com",
      githubUrl: "https://github.com/example/repo",
    });
    testProjectId = project.id;

    expect(project.websiteUrl).toBe("https://example.com");
    expect(project.githubUrl).toBe("https://github.com/example/repo");
  });

  it("should reject invalid URLs", async () => {
    const createInvalid = async () =>
      createProject({
        name: "Bad URLs",
        description: "Invalid URLs",
        displayOrder: 8,
        websiteUrl: "not-a-url",
      });

    await expect(createInvalid()).rejects.toThrow();
  });
});
