"use client";

import { useState, useTransition } from "react";
import type { Feature, Screenshot } from "@/generated/prisma/client";
import { deleteFeatureAction, deleteScreenshotAction } from "./actions";
import { ScreenshotForm } from "./screenshot-form";

type EditableFeature = Pick<
  Feature,
  "id" | "name" | "description" | "displayOrder"
> & { screenshots: Pick<Screenshot, "id" | "url" | "altText" | "displayOrder">[] };

type FeatureDraft = Omit<EditableFeature, "id"> & { id?: string };

/** Collects the addable and editable feature fields used by project forms. */
export function FeatureFields({
  initialFeatures = [],
}: {
  initialFeatures?: EditableFeature[];
}) {
  const [features, setFeatures] = useState<FeatureDraft[]>(initialFeatures);
  const [isRemovingFeature, startFeatureRemoval] = useTransition();
  const [isRemovingScreenshot, startScreenshotRemoval] = useTransition();

  function updateFeature<K extends keyof FeatureDraft>(
    index: number,
    field: K,
    value: FeatureDraft[K]
  ) {
    setFeatures((current) =>
      current.map((feature, currentIndex) =>
        currentIndex === index ? { ...feature, [field]: value } : feature
      )
    );
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium">Features</legend>
      {features.map((feature, index) => (
        <div
          key={feature.id ?? `new-feature-${index}`}
          className="mt-2 space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800"
        >
          <input type="hidden" name="featureIds" value={feature.id ?? ""} />
          <label className="block text-sm">
            Name
            <input
              name="featureNames"
              value={feature.name}
              onChange={(event) => updateFeature(index, "name", event.target.value)}
              required
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="block text-sm">
            Description
            <textarea
              name="featureDescriptions"
              value={feature.description}
              onChange={(event) =>
                updateFeature(index, "description", event.target.value)
              }
              required
              rows={3}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="block text-sm">
            Display order
            <input
              name="featureDisplayOrders"
              type="number"
              min="0"
              value={feature.displayOrder}
              onChange={(event) =>
                updateFeature(index, "displayOrder", Number(event.target.value))
              }
              required
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          {!feature.id && (
            <button
              type="button"
              onClick={() =>
                setFeatures((current) =>
                  current.filter((_, currentIndex) => currentIndex !== index)
                )
              }
              className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              Remove
            </button>
          )}
          {feature.id && (
            <>
              <button
                type="button"
                disabled={isRemovingFeature}
                onClick={() => {
                  if (
                    !window.confirm(
                      "Remove this feature and its screenshots? This cannot be undone."
                    )
                  ) {
                    return;
                  }
                  startFeatureRemoval(() => deleteFeatureAction(feature.id!));
                }}
                className="rounded border border-red-700 px-3 py-2 text-sm text-red-700 disabled:opacity-50 dark:border-red-500 dark:text-red-400"
              >
                {isRemovingFeature ? "Removing..." : "Remove feature"}
              </button>
              {feature.screenshots.length > 0 && (
                <ul className="space-y-2 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
                  {feature.screenshots.map((screenshot) => (
                    <li
                      key={screenshot.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span>{screenshot.altText}</span>
                      <button
                        type="button"
                        disabled={isRemovingScreenshot}
                        onClick={() => {
                          if (
                            !window.confirm(
                              "Remove this screenshot? This cannot be undone."
                            )
                          ) {
                            return;
                          }
                          startScreenshotRemoval(() =>
                            deleteScreenshotAction(screenshot.id)
                          );
                        }}
                        className="rounded border border-red-700 px-3 py-1 text-sm text-red-700 disabled:opacity-50 dark:border-red-500 dark:text-red-400"
                      >
                        {isRemovingScreenshot
                          ? "Removing..."
                          : "Remove screenshot"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <ScreenshotForm featureId={feature.id} />
            </>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setFeatures((current) => [
            ...current,
            {
              name: "",
              description: "",
              displayOrder: current.length,
              screenshots: [],
            },
          ])
        }
        className="mt-2 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      >
        Add feature
      </button>
    </fieldset>
  );
}
