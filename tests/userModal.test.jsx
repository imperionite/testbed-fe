import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import UserModal from "../src/features/users/components/UserModal";

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
    const markup = renderToStaticMarkup(
      <UserModal
        open
        mode="create"
        disablePortal
        permissions={administratorPermissions}
        onClose={() => {}}
      />,
    );

    expect(markup).toContain("Create User");
    expect(markup).toContain("Password");
    expect(markup).toContain("Submit");
  });

  it("shows view mode without edit action for a non-admin user", () => {
    const markup = renderToStaticMarkup(
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

    expect(markup).toContain("View User");
    expect(markup).not.toContain(">Edit</button>");
  });
});
