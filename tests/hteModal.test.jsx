import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HteModal from "../src/features/htes/components/HteModal";

const adminPermissions = { canCreate: true, canEdit: true };
const readonlyPermissions = { canCreate: false, canEdit: false };

const sampleHte = {
  id: "hte-1",
  company_name: "Test Corp",
  address: "123 Street",
  contact_person: "Juan dela Cruz",
  contact_email: null,
  contact_number: null,
  supervisor_id: null,
  is_active: true,
};

describe("HteModal role and mode behavior", () => {
  it("shows Create HTE title and Submit button in create mode", () => {
    const markup = renderToStaticMarkup(
      <HteModal
        open
        disablePortal
        mode="create"
        permissions={adminPermissions}
        viewerRole="administrator"
        onClose={() => {}}
      />,
    );

    expect(markup).toContain("Create HTE");
    expect(markup).toContain("Submit");
    expect(markup).not.toContain("Edit HTE");
  });

  it("shows Edit button in view mode for admin but not for readonly permissions", () => {
    const adminMarkup = renderToStaticMarkup(
      <HteModal
        open
        disablePortal
        mode="view"
        hte={sampleHte}
        permissions={adminPermissions}
        viewerRole="administrator"
        onClose={() => {}}
      />,
    );

    const readonlyMarkup = renderToStaticMarkup(
      <HteModal
        open
        disablePortal
        mode="view"
        hte={sampleHte}
        permissions={readonlyPermissions}
        viewerRole="faculty_adviser"
        onClose={() => {}}
      />,
    );

    expect(adminMarkup).toContain("View HTE");
    expect(adminMarkup).toContain(">Edit<");
    expect(readonlyMarkup).toContain("View HTE");
    expect(readonlyMarkup).not.toContain(">Edit<");
  });

  it("shows Save and Cancel buttons in edit mode", () => {
    const markup = renderToStaticMarkup(
      <HteModal
        open
        disablePortal
        mode="edit"
        hte={sampleHte}
        permissions={adminPermissions}
        viewerRole="administrator"
        onClose={() => {}}
      />,
    );

    expect(markup).toContain("Edit HTE");
    expect(markup).toContain(">Save<");
    expect(markup).toContain(">Cancel<");
  });
});
