import { afterEach, describe, expect, it, vi } from "vitest";

const { mockSignOut } = vi.hoisted(() => ({ mockSignOut: vi.fn() }));

vi.mock("@/auth", () => ({ signOut: mockSignOut }));

import { signOutFromNavigation } from "../auth-actions";

describe("signOutFromNavigation", () => {
  afterEach(() => {
    mockSignOut.mockReset();
  });

  it("delegates logout to the configured Auth.js implementation", async () => {
    await signOutFromNavigation();

    expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: "/" });
  });
});
