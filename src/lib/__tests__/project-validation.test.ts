import { describe, expect, it } from "vitest";
import {
  createProjectInputSchema,
  updateProjectInputSchema,
} from "../project-validation";

const validProjectInput = {
  name: "Test project",
  description: "A test project.",
  technologies: [],
  displayOrder: 0,
  published: false,
};

describe("project URL validation", () => {
  it.each(["websiteUrl", "githubUrl"] as const)(
    "rejects javascript URLs for %s when creating a project",
    (field) => {
      const result = createProjectInputSchema.safeParse({
        ...validProjectInput,
        [field]: "javascript:alert(1)",
      });

      expect(result.success).toBe(false);
    }
  );

  it.each(["websiteUrl", "githubUrl"] as const)(
    "rejects javascript URLs for %s when updating a project",
    (field) => {
      const result = updateProjectInputSchema.safeParse({
        [field]: "javascript:alert(1)",
      });

      expect(result.success).toBe(false);
    }
  );

  it("accepts http and https URLs", () => {
    expect(
      createProjectInputSchema.safeParse({
        ...validProjectInput,
        websiteUrl: "http://example.com",
        githubUrl: "https://github.com/example/project",
      }).success
    ).toBe(true);
  });
});
