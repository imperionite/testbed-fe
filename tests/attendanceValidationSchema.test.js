import { describe, it, expect } from "vitest";
import { getValidationSchema } from "../src/features/attendance/validation/AttendanceValidationSchema";
import { MODES } from "../src/features/attendance/form/formConfig";

describe("AttendanceValidationSchema", () => {
  describe("Create Mode", () => {
    const schema = getValidationSchema(MODES.CREATE);

    it("should validate a valid attendance creation payload", () => {
      const validPayload = {
        internship_id: "550e8400-e29b-41d4-a716-446655440000",
        attendance_date: "2026-09-10",
        time_in: "08:00",
        time_out: "17:00",
      };
      const result = schema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should fail if required fields are missing", () => {
      const invalidPayload = {
        internship_id: "550e8400-e29b-41d4-a716-446655440000",
        attendance_date: "2026-09-10",
      };
      const result = schema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("Validate Mode", () => {
    const schema = getValidationSchema(MODES.VALIDATE);

    it("should validate a valid status", () => {
      const validPayload = { validation_status: "validated" };
      const result = schema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should fail for invalid status", () => {
      const invalidPayload = { validation_status: "pending" };
      const result = schema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
