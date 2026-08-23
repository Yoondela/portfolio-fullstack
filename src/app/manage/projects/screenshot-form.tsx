"use client";

import { useActionState } from "react";
import { initialProjectActionState } from "./action-state";
import { createScreenshotAction } from "./actions";

/** Collects a URL-based screenshot for an existing feature. */
export function ScreenshotForm({ featureId }: { featureId: string }) {
  const [state, formAction, pending] = useActionState(
    createScreenshotAction.bind(null, featureId),
    initialProjectActionState
  );

  return (
    <form action={formAction} className="mt-3 space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <p className="text-sm font-medium">Add screenshot</p>
      <input
        name="url"
        type="url"
        required
        placeholder="Screenshot URL"
        aria-label="Screenshot URL"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      />
      <input
        name="altText"
        required
        placeholder="Screenshot description"
        aria-label="Screenshot description"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      />
      <input
        name="displayOrder"
        type="number"
        min="0"
        defaultValue="0"
        required
        aria-label="Screenshot display order"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      />
      {state.success ? (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          Screenshot added.
        </p>
      ) : state.error ? (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700"
      >
        {pending ? "Adding..." : "Add screenshot"}
      </button>
    </form>
  );
}
