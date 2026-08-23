import { redirect } from "next/navigation";

/** Sends the protected management entry route to its initial projects view. */
export default function ManagePage() {
  redirect("/manage/projects");
}
