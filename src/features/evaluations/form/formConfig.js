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

// Usage: InternshipCoordinatorAndStudentRules(createRule, editRule, viewRule)
const InternshipCoordinatorAndStudentRules = (create, edit, view) => ({
  [ROLES.INTERNSHIP_COORDINATOR]: {
    [MODES.CREATE]: create,
    [MODES.EDIT]: edit,
    [MODES.VIEW]: view,
  },
  [ROLES.STUDENT]: {
    [MODES.CREATE]: create,
    [MODES.EDIT]: edit,
    [MODES.VIEW]: view,
  },
});

const HteSupervisorRules = (create, edit, view) => ({
  [ROLES.HTE_SUPERVISOR]: {
    [MODES.CREATE]: create,
    [MODES.EDIT]: edit,
    [MODES.VIEW]: view,
  },
});

export const evaluationFormConfig = [
  {
    name: "id",
    label: "ID",
    type: "text",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
    HteSupervisorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    )]
  },
    {
    name: "internship_id",
    label: "Intern",
    type: "intern-select",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
    HteSupervisorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    )]
  },
  {
    name: "evaluator_id",
    label: "Evaluator",
    type: "text",
   rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
    HteSupervisorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    )]
  },
    {
    name: "evaluation_type",
    label: "Evaluation Type",
    type: "evaluation_type",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
    HteSupervisorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    )]
  },
   {
    name: "responses",
    label: "Rating",
    type: "responses",
   rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
    HteSupervisorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    )]
  },
     {
    name: "comments",
    label: "Comments",
    type: "comments",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
    HteSupervisorRules(
      FIELD_RULES.EDITABLE,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    )]
  },
  {
    name: "created_at",
    label: "Created At",
    type: "text",
    format: "date",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
      HteSupervisorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    )],
  },
  {
    name: "updated_at",
    label: "Updated At",
    type: "text",
    format: "date",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
      HteSupervisorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    )],
  },
  {
    name: "status",
    label: "Status",
    type: "status",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
      HteSupervisorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.EDITABLE,
      FIELD_RULES.READONLY,
    )],
  },
    {
    name: "submitted_at",
    label: "Submitted At",
    type: "text",
    rbac: [InternshipCoordinatorAndStudentRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
    ),
      HteSupervisorRules(
      FIELD_RULES.HIDDEN,
      FIELD_RULES.READONLY,
      FIELD_RULES.READONLY,
    )],
  },
];
