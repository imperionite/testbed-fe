export const ROLES = {
  ADMIN: 'administrator',
  INTERNSHIP_COORDINATOR: 'internship_coordinator',
  FACULTY_ADVISER: 'faculty_adviser',
  HTE_SUPERVISOR: 'hte_supervisor',
  STUDENT: 'student',
}

export const MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
}

export const FIELD_RULES = {
  HIDDEN: 'hidden',
  READONLY: 'readonly',
  EDITABLE: 'editable',
  REQUIRED: 'required',
}

// Imported into files requiring role constants
export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Administrator' },
  { value: ROLES.INTERNSHIP_COORDINATOR, label: 'Internship Coordinator' },
  { value: ROLES.FACULTY_ADVISER, label: 'Faculty Adviser' },
  { value: ROLES.HTE_SUPERVISOR, label: 'HTE Supervisor' },
  { value: ROLES.STUDENT, label: 'Student' },
]
