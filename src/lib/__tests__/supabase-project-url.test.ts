import { describe, expect, it } from "vitest";
import { getSupabaseProjectUrl } from "../supabase-project-url";

describe("getSupabaseProjectUrl", () => {
  it("converts a Supabase REST endpoint to the project URL", () => {
    expect(
      getSupabaseProjectUrl("https://example.supabase.co/rest/v1/")
    ).toBe("https://example.supabase.co");
  });

  it("preserves a configured project URL", () => {
    expect(getSupabaseProjectUrl("https://example.supabase.co")).toBe(
      "https://example.supabase.co"
    );
  });
});
