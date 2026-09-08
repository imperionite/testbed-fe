export const ROLES = {
  ADMIN: "administrator",
  INTERNSHIP_COORDINATOR: "internship_coordinator",
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

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export const internshipFormConfig = [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "hteId",
    label: "Host Training Establishment (HTE)",
    type: "select",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "requiredHours",
    label: "Required Hours",
    type: "number",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "facultyAdviserId",
    label: "Faculty Adviser",
    type: "select",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: STATUS_OPTIONS,
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
];
