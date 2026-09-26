import { useQuery } from '@tanstack/react-query'

import { evaluationsApi } from '../../../api/evaluations'
import { internshipsApi } from '../../../api/internships'
import { studentApi } from '../../../api/students'
import { htesApi } from '../../../api/htes'
import { EVALUATION_STATUSES } from '../../../shared/constants/constants'

export function useMyEvaluations(enabled = true) {
  return useQuery({
    queryKey: ['evaluations', 'me'],
    queryFn: evaluationsApi.listMyEvaluations,
    enabled,
  })
}

export function useInternEvaluations(internshipId, enabled = true) {
  return useQuery({
    queryKey: ['evaluations', 'internship', internshipId],
    queryFn: () => evaluationsApi.listInternEvaluations(internshipId),
    enabled: Boolean(internshipId) && enabled,
  })
}

export function useEvaluation(id, enabled = true) {
  return useQuery({
    queryKey: ['evaluations', id],
    queryFn: () => evaluationsApi.getEvaluation(id),
    enabled: Boolean(id) && enabled,
    select: (data) => ({
      ...data,
      isDraft: data?.status === EVALUATION_STATUSES.DRAFT,
      isSubmitted: data?.status === EVALUATION_STATUSES.SUBMITTED,
      displayName: `Evaluation #${data?.id}`,
    }),
  })
}

export function useEvaluationContext(role) {
  const normalizedRole = role?.toLowerCase()

  const isEvaluator = normalizedRole === 'hte_supervisor' || normalizedRole === 'faculty_adviser'

  const isStudent = normalizedRole === 'student'

  const evaluatorQuery = useMyEvaluations(isEvaluator)

  const hteStudentsQuery = useQuery({
    queryKey: ['htes', 'my', 'students'],
    queryFn: htesApi.getMyHteStudents,
    enabled: normalizedRole === 'hte_supervisor',
  })

  const facultyStudentsQuery = useQuery({
    queryKey: ['students', 'assigned'],
    queryFn: studentApi.listAssignedStudents,
    enabled: normalizedRole === 'faculty_adviser',
  })

  /*
   * Student evaluations are retrieved directly through
   * GET /evaluations/me.
   *
   * This intentionally does NOT depend on currentInternship,
   * because completed internships must remain visible in
   * evaluation history.
   */
  const studentEvaluationsQuery = useMyEvaluations(isStudent)

  const staffInternshipsQuery = useQuery({
    queryKey: ['internships', 'all'],
    queryFn: internshipsApi.listInternships,
    enabled: normalizedRole === 'administrator' || normalizedRole === 'internship_coordinator',
  })

  return {
    evaluatorEvaluations: evaluatorQuery.data ?? [],
    evaluatorQuery,

    studentEvaluations: studentEvaluationsQuery.data ?? [],
    studentEvaluationsQuery,

    hteStudents: hteStudentsQuery.data ?? [],
    hteStudentsQuery,

    facultyStudents: facultyStudentsQuery.data ?? [],
    facultyStudentsQuery,

    staffInternships: staffInternshipsQuery.data ?? [],
    staffInternshipsQuery,

    studentProfile: null,
    studentQuery: {
      data: null,
      isLoading: false,
      isError: false,
    },
  }
}

export function toInternshipOption(record) {
  const internshipId = record?.id ?? record?.internship_id ?? record?.currentInternship?.id

  if (!internshipId) {
    return null
  }

  const student = record?.student_profiles ?? record?.currentInternship?.student_profiles ?? record

  const profile = student?.profiles ?? record?.profiles ?? null

  const studentName = [
    profile?.first_name,
    profile?.middle_name,
    profile?.last_name,
    profile?.suffix,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    internshipId,
    studentName: studentName || 'Unknown student',
    studentNumber: student?.student_number ?? '',
    email: profile?.email ?? '',
    program: student?.program ?? '',
    yearLevel: student?.year_level ?? null,
    section: student?.section ?? null,
  }
}
