import { describe, expect, it } from "vitest";
import {
  canDoOperation,
  getFieldRule,
  getUserManagementPermissions,
} from "../src/features/users/userPermissions";
import {
  FIELD_RULES,
  MODES,
  ROLES,
  userFormConfig,
} from "../src/features/users/form/formConfig";
import getValidationSchema from "../src/features/users/form/UserValidationSchema";

describe("user permissions", () => {
  it("grants administrators management access and denies other roles", () => {
    expect(getUserManagementPermissions(ROLES.ADMIN).canEdit).toBe(true);
    expect(getUserManagementPermissions(ROLES.STUDENT).canEdit).toBe(false);
  });

  it("allows only administrators to submit create and edit forms", () => {
    expect(canDoOperation(ROLES.ADMIN, MODES.CREATE)).toBe(true);
    expect(canDoOperation(ROLES.ADMIN, MODES.EDIT)).toBe(true);
    expect(canDoOperation(ROLES.STUDENT, MODES.EDIT)).toBe(false);
  });

  it("keeps role field editable only for administrators in edit mode", () => {
    const roleField = userFormConfig.find((field) => field.name === "role");

    expect(getFieldRule(roleField, ROLES.ADMIN, MODES.EDIT)).toBe(
      FIELD_RULES.EDITABLE,
    );
    expect(getFieldRule(roleField, ROLES.STUDENT, MODES.EDIT)).toBe(
      FIELD_RULES.HIDDEN,
    );
  });

  it("returns user-friendly required errors", () => {
    const schema = getValidationSchema(MODES.CREATE);
    const result = schema.safeParse({
      email: undefined,
      first_name: undefined,
      last_name: undefined,
      middle_name: undefined,
      suffix: undefined,
      role: undefined,
      password: undefined,
    });
    
    expect(result.success).toBe(false);
    expect(
      result.error.issues.some(
        (issue) =>
          issue.path[0] === "email" && issue.message === "Email is required",
      ),
    ).toBe(true);
  });
});
