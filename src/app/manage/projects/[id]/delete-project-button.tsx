"use client";

import { deleteProjectAction } from "../actions";

/** Confirms the destructive operation before invoking the protected Server Action. */
export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const deleteProject = deleteProjectAction.bind(null, projectId);

  return (
    <form
      action={deleteProject}
      className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800"
      onSubmit={(event) => {
        if (!window.confirm("Delete this project? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white"
      >
        Delete project
      </button>
    </form>
  );
}
