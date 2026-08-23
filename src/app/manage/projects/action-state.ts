export type ProjectActionResult =
  | { success: true }
  | { success: false; error: string };

export const initialProjectActionState: ProjectActionResult = {
  success: false,
  error: "",
};
