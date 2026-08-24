/** Returns a URL only when it is safe to render as a public web link. */
export function getSafePublicUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}
