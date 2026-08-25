import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EngineeringPage, { metadata } from "../page";

const technologyCoverage = [
  "Languages",
  "TypeScript",
  "Frontend",
  "React",
  "Backend / APIs",
  "Node.js",
  "Data",
  "PostgreSQL",
  "Testing",
  "Vitest",
  "Infrastructure / Delivery",
  "Git",
  "Authentication / integrations",
  "Auth.js",
  "AI-assisted development",
  "Codex",
];

const conceptCoverage = [
  "Application architecture",
  "Architectural decision records (ADRs)",
  "Backend / application design",
  "REST API design",
  "Data-access boundaries",
  "Testing / quality",
  "Regression testing",
  "Security",
  "Argon2id",
  "Delivery / workflow",
  "Git worktrees",
];

const workflowSteps = [
  "Requirements",
  "Architecture / decisions",
  "Small implementation slice",
  "Test",
  "Review",
  "Refine",
  "Ship",
];

const exploringTopics = [
  "Object storage and signed uploads",
  "Deeper Next.js application architecture",
  "Production deployment",
  "AI-agent engineering workflows",
];

describe("EngineeringPage", () => {
  it("renders the engineering inventory, workflow, and learning areas", () => {
    const markup = renderToStaticMarkup(<EngineeringPage />);

    expect(markup).toContain("Engineering notebook");
    expect(markup).toContain("Technology inventory");
    for (const item of technologyCoverage) expect(markup).toContain(item);
    expect(markup).toContain("Familiar");
    expect(markup).toContain("Working");
    expect(markup).toContain("Proficient");
    expect(markup).toContain("Strong");
    expect(markup).toContain("Engineering concepts in practice");
    for (const item of conceptCoverage) expect(markup).toContain(item);
    expect(markup).toContain("How I work");
    for (const step of workflowSteps) expect(markup).toContain(step);
    expect(markup).toContain("AI-assisted development is part of this workflow");
    expect(markup).toContain("Currently exploring");
    for (const topic of exploringTopics) expect(markup).toContain(topic);
  });

  it("provides route-specific metadata", () => {
    expect(metadata.title).toBe("Engineering | Yondela Sasayi");
    expect(metadata.description).toContain("engineering practices");
  });
});
