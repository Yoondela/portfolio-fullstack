"use client";

import { useRef, useState, useTransition } from "react";
import {
  SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES,
  SCREENSHOT_UPLOAD_MAX_SIZE_BYTES,
} from "@/lib/screenshot-storage-config";
import {
  initialProjectActionState,
  type ProjectActionResult,
} from "./action-state";
import {
  createScreenshotAction,
  createScreenshotUploadUrlAction,
  deletePendingScreenshotUploadAction,
} from "./actions";
import { uploadScreenshotFile } from "./upload-screenshot";

/** Uploads one screenshot directly to Storage without nesting another form in the editor. */
export function ScreenshotForm({ featureId }: { featureId: string }) {
  const [state, setState] = useState(initialProjectActionState);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [pending, startTransition] = useTransition();

  function addScreenshot() {
    if (!file) {
      setState({ success: false, error: "Choose a screenshot image first." });
      return;
    }
    if (!SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES.includes(file.type as never)) {
      setState({
        success: false,
        error: "Choose a JPEG, PNG, or WebP image.",
      });
      return;
    }
    if (file.size === 0 || file.size > SCREENSHOT_UPLOAD_MAX_SIZE_BYTES) {
      setState({ success: false, error: "Screenshot image must be 5 MB or smaller." });
      return;
    }
    if (altText.length === 0 || altText.length > 255) {
      setState({
        success: false,
        error: "Screenshot description must be between 1 and 255 characters.",
      });
      return;
    }
    const parsedDisplayOrder = Number(displayOrder);
    if (!Number.isInteger(parsedDisplayOrder) || parsedDisplayOrder < 0) {
      setState({ success: false, error: "Screenshot display order is invalid." });
      return;
    }

    const formData = new FormData();
    formData.set("altText", altText);
    formData.set("displayOrder", displayOrder);

    startTransition(async () => {
      try {
        const upload = await createScreenshotUploadUrlAction(featureId, {
          contentType: file.type,
          size: file.size,
        });
        if (!upload.success) {
          setState(upload);
          return;
        }
        const successfulUpload = upload;

        async function cleanUpUpload(): Promise<boolean> {
          try {
            const cleanup = await deletePendingScreenshotUploadAction(
              featureId,
              successfulUpload.storagePath
            );
            return cleanup.success;
          } catch {
            return false;
          }
        }

        try {
          await uploadScreenshotFile(successfulUpload.signedUrl, file);
        } catch {
          const cleanupSucceeded = await cleanUpUpload();
          setState({
            success: false,
            error: cleanupSucceeded
              ? "Screenshot could not be uploaded. Please try again."
              : "Screenshot upload could not be confirmed or removed.",
          });
          return;
        }
        formData.set("storagePath", successfulUpload.storagePath);

        let result: ProjectActionResult;
        try {
          result = await createScreenshotAction(
            featureId,
            initialProjectActionState,
            formData
          );
        } catch {
          const cleanupSucceeded = await cleanUpUpload();
          setState({
            success: false,
            error: cleanupSucceeded
              ? "Screenshot could not be saved. Please try again."
              : "Screenshot was uploaded but could not be saved or removed.",
          });
          return;
        }
        if (!result.success) {
          const cleanupSucceeded = await cleanUpUpload();
          setState(
            cleanupSucceeded
              ? result
              : {
                  success: false,
                  error:
                    "Screenshot was uploaded but could not be saved or removed.",
                }
          );
          return;
        }
        setState(result);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setAltText("");
        setDisplayOrder("0");
      } catch {
        setState({
          success: false,
          error: "Screenshot could not be uploaded. Please try again.",
        });
      }
    });
  }

  return (
    <div className="mt-3 space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <p className="text-sm font-medium">Add screenshot</p>
      <input
        ref={fileInputRef}
        type="file"
        accept={SCREENSHOT_UPLOAD_ALLOWED_MIME_TYPES.join(",")}
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        aria-label="Screenshot image"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
      />
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        JPEG, PNG, or WebP; up to 5 MB.
      </p>
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
        {pending ? "Uploading..." : "Upload screenshot"}
      </button>
    </div>
  );
}
