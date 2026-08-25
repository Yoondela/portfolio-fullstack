import type { Metadata } from "next";

type Proficiency = "Familiar" | "Working" | "Proficient" | "Strong";

type Technology = {
  name: string;
  level: Proficiency;
};

export const metadata: Metadata = {
  title: "Engineering | Yondela Sasayi",
  description:
    "Technologies, engineering practices, and current areas of software-development learning.",
};

const proficiencyStyles: Record<Proficiency, string> = {
  Familiar:
    "border-stone-300 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300",
  Working:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  Proficient:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  Strong:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
};

const technologyGroups: { title: string; items: Technology[] }[] = [
  {
    title: "Languages",
    items: [
      { name: "JavaScript", level: "Strong" },
      { name: "TypeScript", level: "Strong" },
      { name: "Python", level: "Working" },
      { name: "SQL", level: "Proficient" },
      { name: "Java", level: "Familiar" },
      { name: "C#", level: "Familiar" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", level: "Strong" },
      { name: "Next.js", level: "Strong" },
      { name: "HTML", level: "Strong" },
      { name: "CSS", level: "Strong" },
      { name: "SCSS / Sass", level: "Working" },
      { name: "Tailwind CSS", level: "Proficient" },
      { name: "Vite", level: "Proficient" },
    ],
  },
  {
    title: "Backend / APIs",
    items: [
      { name: "Node.js", level: "Strong" },
      { name: "Express", level: "Proficient" },
      { name: "Fastify", level: "Working" },
      { name: "FastAPI", level: "Working" },
      { name: "REST APIs", level: "Strong" },
      { name: "Socket.IO", level: "Working" },
      { name: "WebSockets", level: "Working" },
      { name: "JSON", level: "Strong" },
      { name: "API integration", level: "Strong" },
    ],
  },
  {
    title: "Data",
    items: [
      { name: "PostgreSQL", level: "Strong" },
      { name: "MongoDB", level: "Working" },
      { name: "Prisma", level: "Strong" },
      { name: "Mongoose", level: "Working" },
    ],
  },
  {
    title: "Testing",
    items: [
      { name: "Vitest", level: "Proficient" },
      { name: "Jest", level: "Working" },
      { name: "Supertest", level: "Working" },
      { name: "Unit testing", level: "Proficient" },
      { name: "Integration testing", level: "Proficient" },
      { name: "Test-driven development", level: "Working" },
    ],
  },
  {
    title: "Infrastructure / Delivery",
    items: [
      { name: "Git", level: "Strong" },
      { name: "GitHub", level: "Strong" },
      { name: "GitHub Actions", level: "Working" },
      { name: "Jenkins", level: "Familiar" },
      { name: "Docker", level: "Working" },
      { name: "Linux / Unix environments", level: "Working" },
      { name: "CI/CD", level: "Working" },
      { name: "Vercel", level: "Proficient" },
      { name: "Fly.io", level: "Familiar" },
      { name: "Supabase", level: "Working" },
    ],
  },
  {
    title: "Authentication / integrations",
    items: [
      { name: "Auth.js", level: "Proficient" },
      { name: "Auth0", level: "Working" },
      { name: "Google Maps APIs", level: "Working" },
    ],
  },
  {
    title: "AI-assisted development",
    items: [
      { name: "Codex", level: "Proficient" },
      { name: "GitHub Copilot", level: "Proficient" },
      { name: "AI-assisted debugging", level: "Proficient" },
      { name: "AI-assisted code review", level: "Proficient" },
      { name: "Agent-based development workflows", level: "Proficient" },
    ],
  },
];

const conceptGroups = [
  {
    title: "Application architecture",
    items: [
      "Client/server boundaries",
      "Layered application architecture",
      "Separation of concerns",
      "Architectural decision records (ADRs)",
      "Requirements-driven development",
      "Server/client component boundaries",
    ],
  },
  {
    title: "Backend / application design",
    items: [
      "REST API design",
      "Server Actions",
      "Route Handlers",
      "Input validation",
      "Authentication vs authorization",
      "Server-side authorization",
      "Protected mutations",
      "Real-time communication",
    ],
  },
  {
    title: "Data",
    items: [
      "Relational data modelling",
      "Document data modelling",
      "Database migrations",
      "ORM usage",
      "Data-access boundaries",
      "One-to-many relationships",
      "Cascade deletion",
      "UUID identifiers",
    ],
  },
  {
    title: "Testing / quality",
    items: [
      "Unit testing",
      "Integration testing",
      "Regression testing",
      "Mocking external boundaries",
      "Real-database integration testing",
      "Static type checking",
      "Linting",
      "Code review",
      "Debugging and troubleshooting",
      "Maintainable code",
    ],
  },
  {
    title: "Security",
    items: [
      "Password hashing",
      "Argon2id",
      "JWT sessions",
      "Credential validation",
      "Server-side authorization",
      "Secret and environment-variable management",
      "Safe handling of untrusted input",
      "Safe public URL rendering",
    ],
  },
  {
    title: "Delivery / workflow",
    items: [
      "Git feature branches",
      "Git worktrees",
      "CI/CD",
      "Containerization",
      "Environment configuration",
      "Cloud deployment",
      "Small vertical implementation slices",
      "Implementation → review → fix → test → commit workflow",
    ],
  },
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

const currentlyExploring = [
  "Object storage and signed uploads",
  "Deeper Next.js application architecture",
  "Production deployment",
  "AI-agent engineering workflows",
];

/** Renders a static overview of engineering practice and current learning. */
export default function EngineeringPage() {
  return (
    <div className="max-w-5xl space-y-16 sm:space-y-20">
      <header className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-800 dark:text-amber-300">
          Engineering notebook
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl dark:text-stone-100">
          Building software with intention and room to learn.
        </h1>
        <p className="mt-5 text-base leading-7 text-stone-700 sm:text-lg dark:text-stone-300">
          A practical record of the tools, concepts, and habits I bring to
          software work. Self-assessed proficiency is approximate and
          context-dependent; the useful measure is applying the right tool with
          care.
        </p>
      </header>

      <section aria-labelledby="technology-heading">
        <div className="border-b border-stone-300 pb-4 dark:border-stone-700">
          <h2
            id="technology-heading"
            className="font-serif text-2xl text-stone-900 dark:text-stone-100"
          >
            Technology inventory
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
            An evolving inventory of technologies I have worked with.
          </p>
        </div>

        <dl className="mt-5 flex flex-wrap gap-2 text-xs" aria-label="Proficiency levels">
          {(Object.keys(proficiencyStyles) as Proficiency[]).map((level) => (
            <div
              key={level}
              className={`rounded border px-2 py-1 ${proficiencyStyles[level]}`}
            >
              <dt className="sr-only">Proficiency level</dt>
              <dd>{level}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {technologyGroups.map((group) => (
            <section
              key={group.title}
              aria-labelledby={`${group.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}-heading`}
              className="rounded border border-stone-300 bg-stone-50/70 p-5 dark:border-stone-700 dark:bg-stone-900/70"
            >
              <h3
                id={`${group.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}-heading`}
                className="font-medium text-stone-900 dark:text-stone-100"
              >
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((technology) => (
                  <li
                    key={technology.name}
                    className="flex items-center gap-2 rounded border border-stone-300 bg-stone-100 px-2.5 py-1.5 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                  >
                    <span>{technology.name}</span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide ${proficiencyStyles[technology.level]}`}
                    >
                      {technology.level}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="concepts-heading">
        <div className="border-b border-stone-300 pb-4 dark:border-stone-700">
          <h2
            id="concepts-heading"
            className="font-serif text-2xl text-stone-900 dark:text-stone-100"
          >
            Engineering concepts in practice
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
            Concepts I understand and have applied while building software.
          </p>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {conceptGroups.map((group) => (
            <section key={group.title}>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2 border-l border-stone-300 pl-4 text-sm leading-6 text-stone-700 dark:border-stone-700 dark:text-stone-300">
                {group.items.map((concept) => (
                  <li key={concept}>{concept}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-i-work-heading">
        <div className="border-b border-stone-300 pb-4 dark:border-stone-700">
          <h2
            id="how-i-work-heading"
            className="font-serif text-2xl text-stone-900 dark:text-stone-100"
          >
            How I work
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600 dark:text-stone-400">
            I prefer a visible, repeatable path from an agreed need to a
            verified change.
          </p>
        </div>

        <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm font-medium text-stone-800 dark:text-stone-200">
          {workflowSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-x-3">
              <span className="rounded border border-stone-300 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-900">
                {step}
              </span>
              {index < workflowSteps.length - 1 && (
                <span aria-hidden="true" className="text-amber-800 dark:text-amber-300">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl leading-7 text-stone-700 dark:text-stone-300">
          AI-assisted development is part of this workflow: it can help explore
          options, debug, and review. Engineering judgement, architecture,
          testing, and review remain explicit responsibilities.
        </p>
      </section>

      <section
        aria-labelledby="exploring-heading"
        className="border-y border-stone-300 py-8 dark:border-stone-700"
      >
        <h2
          id="exploring-heading"
          className="font-serif text-2xl text-stone-900 dark:text-stone-100"
        >
          Currently exploring
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {currentlyExploring.map((topic) => (
            <li
              key={topic}
              className="rounded border border-dashed border-stone-300 px-4 py-3 text-sm leading-6 text-stone-700 dark:border-stone-700 dark:text-stone-300"
            >
              {topic}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
