import Link from "next/link";
import { requireAdmin } from "@/lib/auth/authorization";
import { CreateProjectForm } from "./create-project-form";

/** Renders the protected initial project-creation form. */
export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Link
        href="/manage/projects"
        className="text-sm text-zinc-600 underline dark:text-zinc-400"
      >
        Back to projects
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">New Project</h1>
      <CreateProjectForm />
    </main>
  );
}
