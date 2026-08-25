import { ContactForm } from "./contact-form";

/** Renders the portfolio's static contact details. */
export default function ContactPage() {
  return (
    <div className="max-w-3xl space-y-14 sm:space-y-16">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-800 dark:text-amber-300">
          Contact
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl dark:text-stone-100">
          Let&apos;s make something considered.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg dark:text-stone-300">
          For project conversations, collaborations, or a thoughtful exchange
          about engineering, email is the best place to start.
        </p>
      </header>

      <section
        aria-labelledby="email-heading"
        className="border-y border-stone-300 py-8 dark:border-stone-700"
      >
        <h2
          id="email-heading"
          className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"
        >
          Email
        </h2>
        <address className="mt-4 not-italic">
          <a
            href="mailto:yondela08@outlook.com"
            className="font-serif text-2xl text-stone-900 underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:text-stone-100 dark:decoration-stone-500 dark:hover:text-stone-50"
          >
            yondela08@outlook.com
          </a>
          <a
            href="tel:+27799594434"
            className="mt-3 block text-sm text-stone-700 underline decoration-stone-400 underline-offset-4 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:text-stone-300 dark:decoration-stone-500 dark:hover:text-stone-50"
          >
            079 959 4434
          </a>
        </address>
      </section>

      <section aria-labelledby="elsewhere-heading">
        <h2
          id="elsewhere-heading"
          className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"
        >
          Elsewhere
        </h2>
        <dl className="mt-4 grid gap-5 border-l border-stone-300 pl-5 text-sm dark:border-stone-700 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-stone-900 dark:text-stone-100">
              GitHub
            </dt>
            <dd className="mt-1 text-stone-600 dark:text-stone-400">
              Details coming soon.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-stone-900 dark:text-stone-100">
              LinkedIn
            </dt>
            <dd className="mt-1 text-stone-600 dark:text-stone-400">
              Details coming soon.
            </dd>
          </div>
        </dl>
      </section>

      <ContactForm />
    </div>
  );
}
