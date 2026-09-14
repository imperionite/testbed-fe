import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../src/api/axios";
import { studentApi } from "../src/api/students";

vi.mock("../src/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("students API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends the expected camelCase payload for updating own profile", async () => {
    api.patch.mockResolvedValueOnce({ data: { data: { id: "s1" } } });

    const payload = {
      contactNumber: "09999999999",
      address: "New Address",
      emergencyContactName: "New Name",
      emergencyContactNumber: "09888888888",
    };

    await studentApi.updateMyProfile(payload);

    expect(api.patch).toHaveBeenCalledWith("/students/me", payload);
  });
});
