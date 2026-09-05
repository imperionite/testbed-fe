import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import InternshipModal from "../src/features/internships/components/InternshipModal";

const sampleInternship = {
  id: "intern-1",
  student_id: "student-1",
  hte_id: "hte-1",
  required_hours: 480,
  status: "pending",
};

describe("InternshipModal mode behavior", () => {
  it("shows Add New Intern title in create mode", () => {
    const markup = renderToStaticMarkup(
      <InternshipModal
        open
        mode="create"
        onClose={() => {}}
      />,
    );

    expect(markup).toContain("Add New Intern");
  });

  it("shows View Internship title in view mode", () => {
    const markup = renderToStaticMarkup(
      <InternshipModal
        open
        mode="view"
        internship={sampleInternship}
        onClose={() => {}}
      />,
    );

    expect(markup).toContain("View Internship");
  });

  it("shows Edit Internship title in edit mode", () => {
    const markup = renderToStaticMarkup(
      <InternshipModal
        open
        mode="edit"
        internship={sampleInternship}
        onClose={() => {}}
      />,
    );

    expect(markup).toContain("Edit Internship");
  });
});
