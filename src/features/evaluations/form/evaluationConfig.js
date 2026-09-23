export const EVALUATION_TYPES = {
  HTE_SUPERVISOR: 'hte_supervisor',
  FACULTY_ADVISER: 'faculty_adviser',
}

/**
 * Approved evaluation criteria.
 *
 * `key` is the internal/API representation.
 * `label` is the human-readable representation shown in the UI.
 *
 * IMPORTANT:
 * Do not submit the labels to the backend.
 * The backend expects criterion_1 ... criterion_8.
 */
export const EVALUATION_CRITERIA = [
  {
    key: 'criterion_1',
    label: 'Knowledge of Assigned Tasks',
  },
  {
    key: 'criterion_2',
    label: 'Quality of Work',
  },
  {
    key: 'criterion_3',
    label: 'Productivity',
  },
  {
    key: 'criterion_4',
    label: 'Problem-Solving',
  },
  {
    key: 'criterion_5',
    label: 'Communication',
  },
  {
    key: 'criterion_6',
    label: 'Teamwork',
  },
  {
    key: 'criterion_7',
    label: 'Professionalism',
  },
  {
    key: 'criterion_8',
    label: 'Adaptability',
  },
]

export const MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
}

export function getEvaluationTypeForRole(role) {
  switch (role?.toLowerCase()) {
    case 'hte_supervisor':
      return EVALUATION_TYPES.HTE_SUPERVISOR

    case 'faculty_adviser':
      return EVALUATION_TYPES.FACULTY_ADVISER

    default:
      return null
  }
}
