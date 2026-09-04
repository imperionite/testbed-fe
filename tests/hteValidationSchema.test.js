import { describe, it, expect } from "vitest";
import { getValidationSchema } from "../src/features/htes/form/HteValidationSchema";
import { MODES } from "../src/features/htes/form/formConfig";

describe("HteValidationSchema", () => {
  describe("Create Mode", () => {
    const schema = getValidationSchema(MODES.CREATE);

    it("should validate a valid HTE creation payload", () => {
      const validPayload = {
        company_name: "Test Company",
        address: "123 Test St.",
        contact_person: "Maria Clara Santos",
        contact_email: "test@example.com",
        contact_number: "09171234567",
      };
      const result = schema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should fail if required fields are missing", () => {
      const invalidPayload = {};
      const result = schema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues.length).toBeGreaterThan(0);
    });
  });

  describe("Edit Mode", () => {
    const schema = getValidationSchema(MODES.EDIT);

    it("should validate a valid HTE edit payload", () => {
      const validPayload = {
        company_name: "Test Company",
        address: "123 Test St.",
        contact_person: "Maria Clara Santos",
        is_active: true,
      };
      const result = schema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should fail if is_active is not a boolean", () => {
      const invalidPayload = {
        company_name: "Test Company",
        address: "123 Test St.",
        contact_person: "Maria Clara Santos",
        is_active: "true", // Should be boolean
      };
      const result = schema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
