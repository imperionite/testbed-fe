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
});
