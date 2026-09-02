import { getPublishedProjects } from "@/lib/projects";
import { getSafePublicUrl } from "@/lib/public-url";
import { getPublicScreenshotUrl } from "@/lib/supabase-storage";
import { connection } from "next/server";

/** Renders the published portfolio projects in their configured display order. */
export default async function Home() {
  await connection();

  const projects = await getPublishedProjects();

  return (
    <div className="space-y-16 sm:space-y-20">
      <header className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-800 dark:text-amber-300">
          Selected work
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl dark:text-stone-100">
          Engineering with a considered point of view.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg dark:text-stone-300">
          I&apos;m a Web Developer from Cape Town with a foundation in full-stack web
          development and hands-on experience working with modern web technologies.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg dark:text-stone-300">
          This is a collection of practical products, systems, and experiments shaped
          from the inside out.
        </p>
      </header>

      <section aria-labelledby="projects-heading">
        <div className="flex items-end justify-between gap-6 border-b border-stone-300 pb-4 dark:border-stone-700">
          <h2
            id="projects-heading"
            className="font-serif text-2xl text-stone-900 dark:text-stone-100"
          >
            Projects
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="mt-8 rounded border border-dashed border-stone-300 px-5 py-8 text-stone-600 dark:border-stone-700 dark:text-stone-400">
            No projects published yet.
          </p>
        ) : (
          <ul className="mt-8 grid gap-6 lg:grid-cols-1">
            {projects.map((project, projectIndex) => {
            const websiteUrl = getSafePublicUrl(project.websiteUrl);
            const githubUrl = getSafePublicUrl(project.githubUrl);

            return (
              <li
                key={project.id}
                className="h-full rounded border border-stone-300 bg-stone-50/70 p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900/70 sm:p-7"
              >
                <article className="flex h-full flex-col">
                  <header>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                      Project {String(projectIndex + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl text-stone-900 dark:text-stone-100">
                      {project.name}
                    </h3>
                    <p className="mt-3 leading-7 text-stone-700 dark:text-stone-300">
                      {project.description}
                    </p>
                  </header>

                  {project.technologies.length > 0 && (
                    <section className="mt-6">
                      <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                        Stack
                      </h4>
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
                    </section>
                  )}

                  {project.features.length > 0 && (
                    <section className="mt-8 border-t border-stone-200 pt-6 dark:border-stone-800">
                      <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                        Features
                      </h4>
                      <ul className="mt-4 space-y-6">
                        {project.features.map((feature) => (
                          <li key={feature.id}>
                            <h5 className="font-medium text-stone-900 dark:text-stone-100">
                              {feature.name}
                            </h5>
                            <p className="mt-1 text-sm leading-6 text-stone-700 dark:text-stone-300">
                              {feature.description}
                            </p>
                            {feature.screenshots.length > 0 && (
                              <ul
                                aria-label={`${feature.name} screenshots`}
                                className="mt-4 grid gap-3"
                              >
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
                                      <figure>
                                        {/* The Storage bucket is administrator-configured, so
                                         * next/image remote patterns cannot be fixed at build time. */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={url}
                                          alt={screenshot.altText}
                                          loading="lazy"
                                          className="aspect-[4/3] w-full rounded border border-stone-300 bg-stone-100 object-contain dark:border-stone-700 dark:bg-stone-800"
                                        />
                                      </figure>
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

                  {project.note && (
                    <section className="mt-8 border-t border-stone-200 pt-6 dark:border-stone-800">
                      <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                        Note
                      </h4>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-700 dark:text-stone-300">
                        {project.note}
                      </p>
                    </section>
                  )}

                  {(websiteUrl || githubUrl) && (
                    <footer className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-5 text-sm dark:border-stone-800">
                      {websiteUrl && (
                        <a
                          href={websiteUrl}
                          className="font-medium underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:decoration-stone-500 dark:hover:text-stone-50"
                        >
                          Visit site <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          className="font-medium underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:decoration-stone-500 dark:hover:text-stone-50"
                        >
                          Source <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </footer>
                  )}
                </article>
              </li>
            );
          })}
          </ul>
        )}
      </section>

      <p className="text-center text-xl font-medium uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
        End
      </p>
    </div>
  );
}
