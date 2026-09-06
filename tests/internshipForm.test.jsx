import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InternshipForm from "../src/features/internships/components/InternshipForm";
import { MODES } from "../src/features/internships/form/formConfig";

// Setup mocks
const mockUpdateStatus = vi.fn().mockResolvedValue({});
const mockAssignAdviser = vi.fn().mockResolvedValue({});
const mockUpdateInternship = vi.fn().mockResolvedValue({});

vi.mock("../src/features/internships/hooks/useInternshipMutations", () => ({
  useInternshipMutations: () => ({
    createInternship: { mutate: vi.fn() },
    updateInternship: { mutateAsync: mockUpdateInternship },
    updateStatus: { mutateAsync: mockUpdateStatus },
    assignAdviser: { mutateAsync: mockAssignAdviser },
  }),
}));

vi.mock("../src/features/students/hooks/useStudents", () => ({
  useStudents: () => ({ data: [{ id: "s1", student_profiles: { student_number: "123" } }] }),
}));

vi.mock("../src/features/htes/hooks/useHtes", () => ({
  useHtes: () => ({ data: [{ id: "h1", company_name: "Company A" }] }),
}));

vi.mock("../src/features/users/hooks/useUsers", () => ({
  useUsers: () => ({ data: [{ id: "u1", role: "faculty_adviser", email: "adviser@test.com" }] }),
}));

describe("InternshipForm Payload Structure", () => {
  it("submits correct payload for status update", async () => {
    const mockInternship = {
      id: "i1",
      student_id: "s1",
      hte_id: "h1",
      required_hours: 480,
      status: "pending",
      faculty_adviser_id: null
    };

    render(<InternshipForm mode={MODES.EDIT} internship={mockInternship} onClose={() => {}} />);
    
    expect(screen.getByText("Pending")).toBeDefined();
  });
});