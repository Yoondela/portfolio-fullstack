"use client";

import { useState, useTransition } from "react";
import { initialProjectActionState } from "./action-state";
import { createScreenshotAction } from "./actions";

/** Collects an existing screenshot object path without nesting another form in the editor. */
export function ScreenshotForm({ featureId }: { featureId: string }) {
  const [state, setState] = useState(initialProjectActionState);
  const [storagePath, setStoragePath] = useState("");
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [pending, startTransition] = useTransition();

  function addScreenshot() {
    const formData = new FormData();
    formData.set("storagePath", storagePath);
    formData.set("altText", altText);
    formData.set("displayOrder", displayOrder);

    startTransition(async () => {
      const result = await createScreenshotAction(
        featureId,
        initialProjectActionState,
        formData
      );
      setState(result);
      if (result.success) {
        setStoragePath("");
        setAltText("");
        setDisplayOrder("0");
      }
    });
  }

  return (
    <div className="mt-3 space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <p className="text-sm font-medium">Add screenshot</p>
      <input
        value={storagePath}
        onChange={(event) => setStoragePath(event.target.value)}
        placeholder="projects/{projectId}/features/{featureId}/image.webp"
        aria-label="Screenshot storage path"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      />
      <input
        value={altText}
        onChange={(event) => setAltText(event.target.value)}
        placeholder="Screenshot description"
        aria-label="Screenshot description"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      />
      <input
        type="number"
        min="0"
        value={displayOrder}
        onChange={(event) => setDisplayOrder(event.target.value)}
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
        type="button"
        onClick={addScreenshot}
        disabled={pending}
        className="rounded border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700"
      >
        {pending ? "Adding..." : "Add screenshot"}
      </button>
    </div>
  );
}
