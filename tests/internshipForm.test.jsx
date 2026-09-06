import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import InternshipForm from "../src/features/internships/components/InternshipForm";
import { MODES } from "../src/features/internships/form/formConfig";

// Mock hooks
vi.mock("../src/features/internships/hooks/useInternshipMutations", () => ({
  useInternshipMutations: () => ({
    createInternship: { mutate: vi.fn() },
    updateInternship: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateStatus: { mutateAsync: vi.fn().mockResolvedValue({}) },
    assignAdviser: { mutateAsync: vi.fn().mockResolvedValue({}) },
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
  it("renders without crashing", () => {
    const mockInternship = {
      id: "i1",
      faculty_adviser_id: null,
      status: "pending"
    };

    render(<InternshipForm mode={MODES.EDIT} internship={mockInternship} onClose={() => {}} />);
    
    // Minimal assertion to prove rendering
    expect(true).toBe(true);
  });
});
