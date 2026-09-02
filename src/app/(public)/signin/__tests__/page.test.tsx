import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ signIn: vi.fn() }));

import SignInPage from "../page";

describe("SignInPage", () => {
  it("identifies the form as owner-only", async () => {
    const page = await SignInPage({ searchParams: Promise.resolve({}) });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("Owner sign in");
    expect(markup).toContain(
      "This sign-in area is for the portfolio owner only."
    );
    expect(markup).toContain('name="email"');
    expect(markup).toContain('name="password"');
  });

  it("shows a generic error after a rejected sign-in", async () => {
    const page = await SignInPage({
      searchParams: Promise.resolve({ error: "CredentialsSignin" }),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("The email or password is incorrect.");
  });
});
