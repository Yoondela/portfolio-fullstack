import { getPublishedProjects } from "@/lib/projects";
import { getSafePublicUrl } from "@/lib/public-url";
import { getPublicScreenshotUrl } from "@/lib/supabase-storage";

/** Renders the published portfolio projects in their configured display order. */
export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900 dark:text-stone-100">
        Projects
      </h1>

      {projects.length === 0 ? (
        <p className="mt-4 text-stone-600 dark:text-stone-400">
          No projects published yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {projects.map((project) => {
            const websiteUrl = getSafePublicUrl(project.websiteUrl);
            const githubUrl = getSafePublicUrl(project.githubUrl);

            return (
              <li
                key={project.id}
                className="rounded border border-stone-300 bg-stone-50/70 p-5 dark:border-stone-700 dark:bg-stone-900/70 sm:p-6"
              >
                <article>
                  <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-stone-700 dark:text-stone-300">
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
                          className="rounded border border-stone-300 bg-stone-100 px-2 py-1 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                  )}

                  {project.features.length > 0 && (
                    <section className="mt-4">
                      <h3 className="font-medium text-stone-900 dark:text-stone-100">
                        Features
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {project.features.map((feature) => (
                          <li key={feature.id}>
                            <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100">
                              {feature.name}
                            </h4>
                            <p className="text-sm text-stone-700 dark:text-stone-300">
                              {feature.description}
                            </p>
                            {feature.screenshots.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {feature.screenshots.map((screenshot) => {
                                  const url = screenshot.storagePath
                                    ? getPublicScreenshotUrl(
                                        screenshot.storagePath
                                      )
                                    : screenshot.legacyUrl
                                      ? getSafePublicUrl(screenshot.legacyUrl)
                                      : null;

                                  return url ? (
                                    <li key={screenshot.id}>
                                      {/* The Storage bucket is administrator-configured, so
                                       * next/image remote patterns cannot be fixed at build time. */}
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={url}
                                        alt={screenshot.altText}
                                        className="max-h-64 rounded border border-stone-300 dark:border-stone-700"
                                      />
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {(websiteUrl || githubUrl) && (
                    <p className="mt-3 flex gap-3 text-sm">
                      {websiteUrl && (
                        <a
                          href={websiteUrl}
                          className="underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:decoration-stone-500 dark:hover:text-stone-50"
                        >
                          Website
                        </a>
                      )}
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          className="underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:decoration-stone-500 dark:hover:text-stone-50"
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
    </div>
  );
}
