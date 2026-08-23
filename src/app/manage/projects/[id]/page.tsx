import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/authorization";
import { getProjectById } from "@/lib/projects";
import { DeleteProjectButton } from "./delete-project-button";
import { EditProjectForm } from "./edit-project-form";

const projectIdSchema = z.string().uuid();

/** Loads an authorized administrator's project into the edit form. */
export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  if (!projectIdSchema.safeParse(id).success) notFound();

  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Link
        href="/manage/projects"
        className="text-sm text-zinc-600 underline dark:text-zinc-400"
      >
        Back to projects
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Edit Project</h1>
      <EditProjectForm project={project} />
      <DeleteProjectButton projectId={project.id} />
    </main>
  );
}
