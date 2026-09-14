export const ROLES = {
  ADMIN: "administrator",
  INTERNSHIP_COORDINATOR: "internship_coordinator",
  FACULTY_ADVISER: "faculty_adviser",
  HTE_SUPERVISOR: "hte_supervisor",
  STUDENT: "student",
};

export const MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
};

export const FIELD_RULES = {
  HIDDEN: "hidden",
  READONLY: "readonly",
  EDITABLE: "editable",
  REQUIRED: "required",
};

// Usage: adminAndCoordinatorRules(createRule, editRule, viewRule)
const adminAndCoordinatorRules = (create, edit, view) => ({
  [ROLES.ADMIN]: {
    [MODES.CREATE]: create,
    [MODES.EDIT]: edit,
    [MODES.VIEW]: view,
  },
  [ROLES.INTERNSHIP_COORDINATOR]: {
    [MODES.CREATE]: create,
    [MODES.EDIT]: edit,
    [MODES.VIEW]: view,
  },
});

export const hteFormConfig = [
  {
    name: "id",
    label: "ID",
    type: "text",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "created_at",
    label: "Created At",
    type: "text",
    format: "date",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "updated_at",
    label: "Updated At",
    type: "text",
    format: "date",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "company_name",
    label: "Company Name",
    type: "text",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.REQUIRED,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.REQUIRED,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "contact_person",
    label: "Contact Person",
    type: "text",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.REQUIRED,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "contact_email",
    label: "Contact Email",
    type: "email",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "contact_number",
    label: "Contact Number",
    type: "text",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "supervisor_id",
    label: "Supervisor",
    type: "supervisor-select",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
  {
    name: "is_active",
    label: "Status",
    type: "status",
    rbac: adminAndCoordinatorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    ),
  },
];
