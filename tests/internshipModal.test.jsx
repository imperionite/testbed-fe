import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InternshipModal from "../src/features/internships/components/InternshipModal";

// Mock hooks to provide data that matches sampleInternship
vi.mock("../src/features/students/hooks/useStudents", () => ({
  useStudents: () => ({ data: [{ id: "student-1" }] }),
}));

vi.mock("../src/features/htes/hooks/useHtes", () => ({
  useHtes: () => ({ data: [{ id: "hte-1", company_name: "Company A" }] }),
}));

vi.mock("../src/features/users/hooks/useUsers", () => ({
  useUsers: () => ({ data: [] }),
}));

// Mock mutations to prevent errors in form
vi.mock("../src/features/internships/hooks/useInternshipMutations", () => ({
  useInternshipMutations: () => ({
    createInternship: { mutate: vi.fn() },
    updateInternship: { mutateAsync: vi.fn() },
    updateStatus: { mutateAsync: vi.fn() },
    assignAdviser: { mutateAsync: vi.fn() },
  }),
}));

const queryClient = new QueryClient();

const sampleInternship = {
  id: "intern-1",
  student_id: "student-1",
  hte_id: "hte-1",
  required_hours: 480,
  status: "pending",
};

describe("InternshipModal mode behavior", () => {
  it("shows Add New Intern title in create mode", () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <InternshipModal
            open
            mode="create"
            onClose={() => {}}
        />
      </QueryClientProvider>
    );

    expect(getByText("Add New Intern")).toBeDefined();
  });

  it("shows View Internship title in view mode", () => {
    const { getByText } = render(
        <QueryClientProvider client={queryClient}>
            <InternshipModal
                open
                mode="view"
                internship={sampleInternship}
                onClose={() => {}}
            />
        </QueryClientProvider>
    );

    expect(getByText("View Internship")).toBeDefined();
  });

  it("shows Edit Internship title in edit mode", () => {
    const { getByText } = render(
        <QueryClientProvider client={queryClient}>
            <InternshipModal
                open
                mode="edit"
                internship={sampleInternship}
                onClose={() => {}}
            />
        </QueryClientProvider>
    );

    expect(getByText("Edit Internship")).toBeDefined();
  });
});
