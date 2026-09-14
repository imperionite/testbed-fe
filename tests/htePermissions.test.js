import { describe, expect, it } from "vitest";
import {
  canDoOperation,
  getFieldRule,
  getHteManagementPermissions,
  getVisibleHteFields,
} from "../src/features/htes/htePermissions";
import {
  FIELD_RULES,
  MODES,
  ROLES,
  hteFormConfig,
} from "../src/features/htes/form/formConfig";

describe("hte permissions", () => {
  it("grants admin and coordinator management access and denies other roles", () => {
    expect(getHteManagementPermissions(ROLES.ADMIN).canView).toBe(true);
    expect(getHteManagementPermissions(ROLES.INTERNSHIP_COORDINATOR).canView).toBe(true);
    expect(getHteManagementPermissions(ROLES.STUDENT).canView).toBe(false);
    expect(getHteManagementPermissions(ROLES.FACULTY_ADVISER).canEdit).toBe(false);
    expect(getHteManagementPermissions(undefined).canCreate).toBe(false);
  });

  it("allows only administrators to submit create and edit forms", () => {
    expect(canDoOperation(ROLES.ADMIN, MODES.CREATE)).toBe(true);
    expect(canDoOperation(ROLES.ADMIN, MODES.EDIT)).toBe(true);
    expect(canDoOperation(ROLES.INTERNSHIP_COORDINATOR, MODES.CREATE)).toBe(false);
    expect(canDoOperation(ROLES.STUDENT, MODES.EDIT)).toBe(false);
  });

  it("returns correct rule for known roles and hides fields for unknown roles", () => {
    const companyField = hteFormConfig.find((f) => f.name === "company_name");

    expect(getFieldRule(companyField, ROLES.ADMIN, MODES.CREATE)).toBe(FIELD_RULES.REQUIRED);
    expect(getFieldRule(companyField, ROLES.ADMIN, MODES.VIEW)).toBe(FIELD_RULES.READONLY);
    expect(getFieldRule(companyField, ROLES.STUDENT, MODES.EDIT)).toBe(FIELD_RULES.HIDDEN);
    expect(getFieldRule(companyField, undefined, MODES.EDIT)).toBe(FIELD_RULES.HIDDEN);
  });

  it("excludes hidden fields from visible fields list", () => {
    const adminViewFields = getVisibleHteFields(ROLES.ADMIN, MODES.VIEW);
    const studentFields = getVisibleHteFields(ROLES.STUDENT, MODES.VIEW);

    expect(adminViewFields.length).toBeGreaterThan(0);
    expect(studentFields.length).toBe(0);

    // id and created_at are hidden in create mode
    const adminCreateFields = getVisibleHteFields(ROLES.ADMIN, MODES.CREATE);
    expect(adminCreateFields.find((f) => f.name === "id")).toBeUndefined();
    expect(adminCreateFields.find((f) => f.name === "created_at")).toBeUndefined();
  });
});
