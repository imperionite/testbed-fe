/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import React from "react";
import { useStudentMutations } from "../src/features/students/hooks/useStudentMutations";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { studentApi } from "../src/api/students";
import notify from "../src/utils/toast";

// Mock the API and Toast
vi.mock("../src/api/students", () => ({
  studentApi: {
    updateMyProfile: vi.fn(),
    updateStudent: vi.fn(),
  },
}));

vi.mock("../src/utils/toast", () => ({
  default: { success: vi.fn() },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe("useStudentMutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls updateMyProfile for student role", async () => {
    studentApi.updateMyProfile.mockResolvedValueOnce({ id: "s1" });

    const { result } = renderHook(() => useStudentMutations(), { wrapper });

    await result.current.onUpdate.mutateAsync({
      id: "s1",
      payload: { contactNumber: "123" },
      role: "student",
    });

    expect(studentApi.updateMyProfile).toHaveBeenCalledWith({ contactNumber: "123" });
    expect(studentApi.updateStudent).not.toHaveBeenCalled();
    expect(notify.success).toHaveBeenCalledWith("Student updated successfully!");
  });

  it("calls updateStudent for staff role", async () => {
    studentApi.updateStudent.mockResolvedValueOnce({ id: "s1" });

    const { result } = renderHook(() => useStudentMutations(), { wrapper });

    await result.current.onUpdate.mutateAsync({
      id: "s1",
      payload: { contactNumber: "123" },
      role: "administrator",
    });

    expect(studentApi.updateStudent).toHaveBeenCalledWith("s1", { contactNumber: "123" });
    expect(studentApi.updateMyProfile).not.toHaveBeenCalled();
    expect(notify.success).toHaveBeenCalledWith("Student updated successfully!");
  });
});
