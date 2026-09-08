import {
  FIELD_RULES,
  MODES,
  ROLES,
  internshipFormConfig,
} from "./form/formConfig";

export function getInternshipManagementPermissions(role) {
  const canManage =
    role === ROLES.ADMIN || role === ROLES.INTERNSHIP_COORDINATOR;

  return {
    canView: canManage,
    canCreate: canManage,
    canEdit: canManage,
    canChangeAdviser: canManage,
    canChangeStatus: canManage,
    canBulkEdit: canManage,
    canSelectRows: canManage,
  };
}

export function getFieldRule(field, role, mode) {
  return field?.rbac?.[role]?.[mode] ?? FIELD_RULES.HIDDEN;
}

export function canDoOperation(role, mode) {
  return (
    (role === ROLES.ADMIN || role === ROLES.INTERNSHIP_COORDINATOR) &&
    (mode === MODES.CREATE || mode === MODES.EDIT)
  );
}

export function getInternshipFormPermissions(role, mode) {
  return {
    getFieldRule: (field) => getFieldRule(field, role, mode),
    canSubmit: canDoOperation(role, mode),
  };
}

export function getVisibleInternshipFields(role, mode) {
  return internshipFormConfig.filter(
    (field) => getFieldRule(field, role, mode) !== FIELD_RULES.HIDDEN,
  );
}

export const internshipPermissions = getInternshipFormPermissions;
