import { signIn } from "@/auth";

type SignInPageProps = {
  searchParams: Promise<{ error?: string }>;
};

/** Renders the portfolio owner's credentials-only sign-in form. */
export default async function SignInPage({
  searchParams,
}: SignInPageProps) {
  const { error } = await searchParams;

  async function signInAsOwner(formData: FormData) {
    "use server";

    await signIn("credentials", formData);
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <section className="rounded border border-stone-300 bg-stone-50/70 p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900/70 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-800 dark:text-amber-300">
          Private area
        </p>
        <h1 className="mt-4 font-serif text-3xl text-stone-900 dark:text-stone-100">
          Owner sign in
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-700 dark:text-stone-300">
          This sign-in area is for the portfolio owner only.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">
            The email or password is incorrect.
          </p>
        )}

        <form action={signInAsOwner} className="mt-6 space-y-4">
          <input type="hidden" name="redirectTo" value="/manage/projects" />
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-300 dark:focus-visible:outline-amber-300"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
