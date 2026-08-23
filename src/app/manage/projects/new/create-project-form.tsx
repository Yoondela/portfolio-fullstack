"use client";

import { useActionState } from "react";
import {
  createProjectAction,
  initialProjectActionState,
} from "../actions";

/** Collects the initial project fields and displays server validation feedback. */
export function CreateProjectForm() {
  const [state, formAction, pending] = useActionState(
    createProjectAction,
    initialProjectActionState
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <div>
        <label htmlFor="technologies" className="block text-sm font-medium">
          Technology (optional)
        </label>
        <input
          id="technologies"
          name="technologies"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium">
          Website URL (optional)
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium">
          GitHub URL (optional)
        </label>
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <div>
        <label htmlFor="displayOrder" className="block text-sm font-medium">
          Display order
        </label>
        <input
          id="displayOrder"
          name="displayOrder"
          type="number"
          min="0"
          defaultValue="0"
          required
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      {state.success ? (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          Project created.
        </p>
      ) : state.error ? (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create project"}
      </button>
    </form>
  );
}
