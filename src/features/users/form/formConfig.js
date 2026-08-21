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

export const userFormConfig = [
  {
    name: "id",
    label: "ID",
    type: "text",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
    },
  },
  {
    name: "created_at",
    label: "Created At",
    type: "text",
    format: "date",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.READONLY,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "middle_name",
    label: "Middle Name",
    type: "text",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "suffix",
    label: "Suffix",
    type: "text",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.EDITABLE,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { value: ROLES.ADMIN, label: "Administrator" },
      { value: ROLES.INTERNSHIP_COORDINATOR, label: "Internship Coordinator" },
      { value: ROLES.FACULTY_ADVISER, label: "Faculty Adviser" },
      { value: ROLES.HTE_SUPERVISOR, label: "HTE Supervisor" },
      { value: ROLES.STUDENT, label: "Student" },
    ],
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
    {
    name: "is_active",
    label: "Account Status",
      type: "status",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.EDITABLE,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.READONLY,
      },
    },
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    rbac: {
      [ROLES.ADMIN]: {
        [MODES.CREATE]: FIELD_RULES.REQUIRED,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
       [ROLES.INTERNSHIP_COORDINATOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.FACULTY_ADVISER]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.HTE_SUPERVISOR]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
      [ROLES.STUDENT]: {
        [MODES.CREATE]: FIELD_RULES.HIDDEN,
        [MODES.EDIT]: FIELD_RULES.HIDDEN,
        [MODES.VIEW]: FIELD_RULES.HIDDEN,
      },
    },
  },
];
