"use client";

import { setProjectPublishedAction } from "../actions";

/** Switches the project's publication state through a protected Server Action. */
export function PublishProjectButton({
  projectId,
  published,
}: {
  projectId: string;
  published: boolean;
}) {
  const setProjectPublished = setProjectPublishedAction.bind(
    null,
    projectId,
    !published
  );

  return (
    <form action={setProjectPublished} className="mt-8">
      <button
        type="submit"
        className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
      >
        {published ? "Unpublish project" : "Publish project"}
      </button>
    </form>
  );
}
