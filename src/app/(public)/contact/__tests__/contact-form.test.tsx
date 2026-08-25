// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "../contact-form";

const { mockFetch } = vi.hoisted(() => ({ mockFetch: vi.fn() }));

describe("ContactForm", () => {
  afterEach(() => {
    cleanup();
    mockFetch.mockReset();
    vi.unstubAllGlobals();
  });

  async function fillForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Your email address"), "visitor@example.com");
    await user.type(screen.getByLabelText("Subject"), "A project idea");
    await user.type(screen.getByLabelText("Message"), "Can we talk?");
  }

  it("disables submission, announces success, and moves focus to the confirmation", async () => {
    let resolveSubmission: (response: { ok: boolean }) => void;
    const submission = new Promise<{ ok: boolean }>((resolve) => {
      resolveSubmission = resolve;
    });
    mockFetch.mockReturnValue(submission);
    vi.stubGlobal("fetch", mockFetch);
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(mockFetch).toHaveBeenCalledOnce();
    const request = mockFetch.mock.calls[0]?.[1];
    expect(request?.body).toBeInstanceOf(FormData);
    expect(request?.body.get("email")).toBe("visitor@example.com");
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Sending…" })
        .disabled
    ).toBe(true);

    resolveSubmission!({ ok: true });

    const confirmation = await screen.findByRole("status");
    expect(confirmation.textContent).toContain("Thank you. I'll be in touch soon.");
    const heading = screen.getByRole("heading", { name: "Message sent" });
    await waitFor(() => expect(document.activeElement).toBe(heading));
  });

  it("keeps the form available and reports a provider failure", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", mockFetch);
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Your message could not be sent."
    );
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Send message" })
        .disabled
    ).toBe(false);
  });

  it("does not submit when the sender email address is invalid", async () => {
    vi.stubGlobal("fetch", mockFetch);
    const user = userEvent.setup();

    render(<ContactForm />);
    const emailInput = screen.getByLabelText<HTMLInputElement>(
      "Your email address"
    );
    await user.type(emailInput, "not-an-email");
    await user.type(screen.getByLabelText("Subject"), "A project idea");
    await user.type(screen.getByLabelText("Message"), "Can we talk?");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(emailInput.checkValidity()).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
