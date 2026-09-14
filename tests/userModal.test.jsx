import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import UserModal from "../src/features/users/components/UserModal";

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => () => ({ values: {}, errors: {} }),
}));

const administratorPermissions = {
  canCreate: true,
  canEdit: true,
};

const facultyPermissions = {
  canCreate: false,
  canEdit: false,
};

describe("UserModal role and mode behavior", () => {
  it("shows create fields and submit action for an administrator", () => {
    const { getByText } = render(
      <UserModal
        open
        mode="create"
        disablePortal
        permissions={administratorPermissions}
        onClose={() => {}}
      />,
    );

    expect(getByText("Create User")).toBeDefined();
    expect(getByText("Save")).toBeDefined();
  });

  it("shows view mode without edit action for a non-admin user", () => {
    const { getByText, queryByText } = render(
      <UserModal
        open
        mode="view"
        disablePortal
        user={{
          id: "u1",
          email: "student@example.com",
          first_name: "Test",
          last_name: "Student",
          role: "student",
          is_active: true,
        }}
        permissions={facultyPermissions}
        onClose={() => {}}
      />,
    );

    expect(getByText("View User")).toBeDefined();
    expect(queryByText("Edit")).toBeNull();
  });
});
