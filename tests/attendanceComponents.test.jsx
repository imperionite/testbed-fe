import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BadgeAttendanceStatus from "../src/features/attendance/components/BadgeAttendanceStatus";

describe("Attendance Components", () => {
  describe("BadgeAttendanceStatus", () => {
    it("renders correct label for validated status", () => {
      render(<BadgeAttendanceStatus value="validated" />);
      expect(screen.getByText("validated")).toBeDefined();
    });

    it("defaults to Pending if value is null", () => {
      render(<BadgeAttendanceStatus value={null} />);
      expect(screen.getByText("Pending")).toBeDefined();
    });
  });
});
