import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../src/api/axios";
import { usersApi } from "../src/api/users";

vi.mock("../src/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("users API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends the expected payloads for role and status updates", async () => {
    api.patch
      .mockResolvedValueOnce({ data: { data: { id: "u1" } } })
      .mockResolvedValueOnce({ data: { data: { id: "u1" } } });

    await usersApi.updateUserRole("u1", { role: "student" });
    await usersApi.updateStatus("u1", { isActive: true });

    expect(api.patch).toHaveBeenNthCalledWith(1, "/users/u1/role", {
      role: "student",
    });
    expect(api.patch).toHaveBeenNthCalledWith(2, "/users/u1/status", {
      isActive: true,
    });
  });
});
