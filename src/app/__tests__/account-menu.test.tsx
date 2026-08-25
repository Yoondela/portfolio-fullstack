// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockSignOut } = vi.hoisted(() => ({ mockSignOut: vi.fn() }));

vi.mock("../auth-actions", () => ({ signOutFromNavigation: mockSignOut }));

import { AccountMenu } from "../account-menu";

describe("AccountMenu", () => {
  afterEach(() => {
    cleanup();
    mockSignOut.mockReset();
  });

  function avatarButton() {
    return screen.getByRole<HTMLButtonElement>("button", {
      name: "Account menu",
    });
  }

  it("always renders a non-navigating Y avatar with the signed-out presentation", () => {
    render(<AccountMenu isSignedIn={false} />);

    const avatar = avatarButton();
    expect(avatar.textContent).toBe("Y");
    expect(avatar.tagName).toBe("BUTTON");
    expect(avatar.getAttribute("aria-expanded")).toBe("false");
    expect(avatar.className).toContain("bg-transparent");
    expect(avatar.className).toContain("border-stone-500");
  });

  it("toggles the signed-out menu and closes it when its option is selected", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isSignedIn={false} />);

    await user.click(avatarButton());

    const menu = screen.getByRole("menu");
    const signIn = screen.getByRole("menuitem", { name: "Sign in" });
    expect(menu.getAttribute("aria-labelledby")).toBe(avatarButton().id);
    expect(signIn.getAttribute("href")).toBe("/api/auth/signin");
    expect(signIn.getAttribute("tabindex")).toBe("-1");
    expect(avatarButton().getAttribute("aria-expanded")).toBe("true");

    signIn.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(signIn);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("closes when clicked again or when a pointer event occurs outside the menu", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isSignedIn={false} />);

    await user.click(avatarButton());
    await user.click(avatarButton());
    expect(screen.queryByRole("menu")).toBeNull();

    await user.click(avatarButton());
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("supports menu keyboard navigation and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<AccountMenu isSignedIn={true} />);

    const avatar = avatarButton();
    avatar.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: "Manage projects" })
    );

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: "Sign out" })
    );

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: "Manage projects" })
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(avatar);
  });

  it("renders signed-in options and closes before Auth.js sign-out runs", async () => {
    mockSignOut.mockResolvedValue(undefined);
    render(<AccountMenu isSignedIn={true} />);

    const avatar = avatarButton();
    expect(avatar.className).toContain("bg-stone-950");
    expect(avatar.className).toContain("text-stone-50");

    fireEvent.click(avatar);
    const manageProjects = screen.getByRole("menuitem", {
      name: "Manage projects",
    });
    expect(manageProjects.getAttribute("href")).toBe("/manage/projects");
    expect(manageProjects.getAttribute("tabindex")).toBe("-1");

    manageProjects.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(manageProjects);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());

    fireEvent.click(avatar);

    const signOut = screen.getByRole("menuitem", { name: "Sign out" });
    expect(signOut.getAttribute("tabindex")).toBe("-1");
    const form = signOut.closest("form");
    if (!form) throw new Error("Sign out must be submitted through a form");
    fireEvent.submit(form);

    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});
