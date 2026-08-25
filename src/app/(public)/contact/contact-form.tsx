"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const formspreeEndpoint = "https://formspree.io/f/maewrqrw";

type SubmissionStatus = "idle" | "submitting" | "succeeded" | "failed";

/** Submits contact details directly to the public Formspree endpoint. */
export function ContactForm() {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "succeeded") successHeadingRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setStatus("submitting");

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Formspree submission failed");

      form.reset();
      setStatus("succeeded");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "succeeded") {
    return (
      <section
        aria-labelledby="contact-form-heading"
        className="border-y border-stone-300 py-8 dark:border-stone-700"
      >
        <h2
          id="contact-form-heading"
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-serif text-2xl text-stone-900 dark:text-stone-100"
        >
          Message sent
        </h2>
        <p
          role="status"
          className="mt-3 leading-7 text-stone-700 dark:text-stone-300"
        >
          Thank you. I&apos;ll be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-medium underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:decoration-stone-500 dark:hover:text-stone-50"
        >
          Send another message
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="contact-form-heading">
      <h2
        id="contact-form-heading"
        className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"
      >
        Send a message
      </h2>
      <form
        onSubmit={handleSubmit}
        action={formspreeEndpoint}
        method="post"
        className="mt-4 space-y-6"
        aria-busy={status === "submitting"}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Your email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="mt-2 w-full rounded border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 shadow-sm outline-none placeholder:text-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-400"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            maxLength={160}
            className="mt-2 w-full rounded border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 shadow-sm outline-none placeholder:text-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-400"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-stone-900 dark:text-stone-100"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={7}
            maxLength={5_000}
            className="mt-2 w-full resize-y rounded border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 shadow-sm outline-none placeholder:text-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-400"
          />
        </div>
        {status === "failed" && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            Your message could not be sent. Please try again or email me
            directly.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded border border-stone-900 bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
