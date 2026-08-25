/**
 * Converts the existing Supabase REST endpoint configuration to the project URL
 * required by the Supabase JavaScript client. Project-root URLs are unchanged.
 */
export function getSupabaseProjectUrl(configuredUrl: string): string {
  const url = new URL(configuredUrl);

  if (url.pathname.replace(/\/$/, "") === "/rest/v1") {
    url.pathname = "/";
  }

  return url.toString().replace(/\/$/, "");
}
