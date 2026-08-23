"use client";

import { useActionState, useState } from "react";
import type { Project } from "@/generated/prisma/client";
import { initialProjectActionState } from "../action-state";
import { updateProjectAction } from "../actions";

type EditableProject = Pick<
  Project,
  | "id"
  | "name"
  | "description"
  | "technologies"
  | "websiteUrl"
  | "githubUrl"
  | "displayOrder"
>;

/** Updates editable fields, including a minimal add/remove technologies list. */
export function EditProjectForm({ project }: { project: EditableProject }) {
  const [state, formAction, pending] = useActionState(
    updateProjectAction.bind(null, project.id),
    initialProjectActionState
  );
  const [technologies, setTechnologies] = useState(project.technologies);

  function updateTechnology(index: number, value: string) {
    setTechnologies((current) =>
      current.map((technology, currentIndex) =>
        currentIndex === index ? value : technology
      )
    );
  }

  function removeTechnology(index: number) {
    setTechnologies((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  }

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
          defaultValue={project.name}
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
          defaultValue={project.description}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Technologies</legend>
        <input type="hidden" name="technologies" value="" />
        {technologies.map((technology, index) => (
          <div key={`technology-${index}`} className="mt-1 flex gap-2">
            <input
              name="technologies"
              aria-label={`Technology ${index + 1}`}
              value={technology}
              onChange={(event) => updateTechnology(index, event.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
            <button
              type="button"
              onClick={() => removeTechnology(index)}
              className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTechnologies((current) => [...current, ""])}
          className="mt-2 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          Add technology
        </button>
      </fieldset>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium">
          Website URL (optional)
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          defaultValue={project.websiteUrl ?? ""}
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
          defaultValue={project.githubUrl ?? ""}
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
          required
          defaultValue={project.displayOrder}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      {state.success ? (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          Project updated.
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
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
