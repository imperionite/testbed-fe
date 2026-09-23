const ROLES = {
  ADMIN: 'administrator',
  COORDINATOR: 'internship_coordinator',
  HTE_SUPERVISOR: 'hte_supervisor',
  FACULTY_ADVISER: 'faculty_adviser',
  STUDENT: 'student',
}

export function getEvaluationPermissions(role) {
  const normalizedRole = role?.toLowerCase()

  return {
    canView:
      normalizedRole === ROLES.ADMIN ||
      normalizedRole === ROLES.COORDINATOR ||
      normalizedRole === ROLES.HTE_SUPERVISOR ||
      normalizedRole === ROLES.FACULTY_ADVISER ||
      normalizedRole === ROLES.STUDENT,

    canCreate: normalizedRole === ROLES.HTE_SUPERVISOR || normalizedRole === ROLES.FACULTY_ADVISER,

    canEdit: normalizedRole === ROLES.HTE_SUPERVISOR || normalizedRole === ROLES.FACULTY_ADVISER,

    canSubmit: normalizedRole === ROLES.HTE_SUPERVISOR || normalizedRole === ROLES.FACULTY_ADVISER,

    canSelectInternship:
      normalizedRole === ROLES.HTE_SUPERVISOR || normalizedRole === ROLES.FACULTY_ADVISER,

    isEvaluator:
      normalizedRole === ROLES.HTE_SUPERVISOR || normalizedRole === ROLES.FACULTY_ADVISER,

    isStudent: normalizedRole === ROLES.STUDENT,

    isReadOnlyStaff: normalizedRole === ROLES.ADMIN || normalizedRole === ROLES.COORDINATOR,
  }
}

export { ROLES }
