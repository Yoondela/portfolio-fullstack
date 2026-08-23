import { getPublishedProjects } from "@/lib/projects";
import { getSafePublicUrl } from "@/lib/public-url";

/** Renders the published portfolio projects in their configured display order. */
export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <h1 className="text-2xl font-semibold">Projects</h1>

      {projects.length === 0 ? (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          No projects published yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {projects.map((project) => {
            const websiteUrl = getSafePublicUrl(project.websiteUrl);
            const githubUrl = getSafePublicUrl(project.githubUrl);

            return (
              <li
                key={project.id}
                className="rounded border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <article>
                  <h2 className="text-lg font-medium">{project.name}</h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>

                  {project.technologies.length > 0 && (
                    <ul
                      aria-label={`${project.name} technologies`}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {project.technologies.map((technology, index) => (
                        <li
                          key={`${technology}-${index}`}
                          className="rounded bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                  )}

                  {(websiteUrl || githubUrl) && (
                    <p className="mt-3 flex gap-3 text-sm">
                      {websiteUrl && (
                        <a
                          href={websiteUrl}
                          className="underline underline-offset-4"
                        >
                          Website
                        </a>
                      )}
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          className="underline underline-offset-4"
                        >
                          GitHub
                        </a>
                      )}
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
