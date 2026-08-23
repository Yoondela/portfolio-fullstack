import { afterEach, describe, expect, it, vi } from "vitest";

const { mockGetProjects, mockRequireAdmin } = vi.hoisted(() => ({
  mockGetProjects: vi.fn(),
  mockRequireAdmin: vi.fn(),
}));

vi.mock("@/lib/auth/authorization", () => ({ requireAdmin: mockRequireAdmin }));
vi.mock("@/lib/projects", () => ({ getProjects: mockGetProjects }));

import ManageProjectsPage from "../page";

describe("ManageProjectsPage", () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockRequireAdmin.mockResolvedValue({ id: "admin-id" });
  });

  it("does not read projects when the visitor is not an administrator", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Forbidden"));

    await expect(ManageProjectsPage()).rejects.toThrow("Forbidden");

    expect(mockGetProjects).not.toHaveBeenCalled();
  });

  it("authorizes before reading projects", async () => {
    mockGetProjects.mockResolvedValue([]);

    await ManageProjectsPage();

    expect(mockRequireAdmin).toHaveBeenCalledOnce();
    expect(mockGetProjects).toHaveBeenCalledOnce();
    expect(mockRequireAdmin.mock.invocationCallOrder[0]).toBeLessThan(
      mockGetProjects.mock.invocationCallOrder[0]
    );
  });
});
