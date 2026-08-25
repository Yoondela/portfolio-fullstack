/** Uploads one image directly to a Supabase signed upload URL. */
export async function uploadScreenshotFile(
  signedUrl: string,
  file: File
): Promise<void> {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "cache-control": "max-age=3600",
      "content-type": file.type,
      "x-upsert": "false",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Screenshot upload failed.");
  }
}
