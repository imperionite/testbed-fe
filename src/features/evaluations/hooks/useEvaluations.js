import { useMemo } from "react"
import { useQuery } from '@tanstack/react-query'
import { evaluationsApi } from '../../../api/evaluations'
import { useHtes } from '../../htes/hooks/useHtes'
import { useStudents } from '../../students/hooks/useStudents'

export function useEvaluations(options = {}) {
  return useQuery({
    queryKey: ['evaluations'],
    queryFn: evaluationsApi.listMyEvaluations,
    ...options,
  })
}

export function useInternEvaluations(id, options = {}) {
  return useQuery({
    queryKey: ['evaluations', 'intern', id],
    queryFn: () => evaluationsApi.listInternEvaluations(id),
    enabled: !!id,
    ...options,
  })
}

export function useEvaluation(id, options = {}) {
  return useQuery({
    queryKey: ['evaluations', id],
    queryFn: () => evaluationsApi.getEvaluation(id),
    enabled: !!id,
    ...options,
  })
}
function formatFullNameFromPayload(profile) {
  if (!profile) return '–'
  return [profile.last_name, profile.first_name, profile.middle_name, profile.suffix]
    .filter(Boolean)
    .join(' ')
}



/**
 * Hook for resolving evaluation data, options, and permission states by role
 */
export function useEvaluationManagementData(
  currentUserRole,
  user,
  isHteSupervisorOrFacultyAdviser,
) {
  const myEvaluationsQuery = useEvaluations({ enabled: isHteSupervisorOrFacultyAdviser })

  // Guard student profile query to only run when role is 'student'
  const myStudentProfile = useStudents(currentUserRole, { enabled: currentUserRole === 'student' })
  const internshipId = myStudentProfile.data?.currentInternship?.id

  const internEvaluationsQuery = useInternEvaluations(internshipId, { enabled: !!internshipId })

  const hteStudentsQuery = useHtes({
    listHtes: {enabled: false},
    listMyHteStudents: { enabled: currentUserRole === 'hte_supervisor' },
  })

  const facultyStudentsQuery = useStudents(currentUserRole, {
    enabled: currentUserRole === 'faculty_adviser',
  })

  // Query config per role
  // internOptions: used in modal dropdown field
  // internMap: used in table name mapping
  return useMemo(() => {
    switch (currentUserRole) {
      case 'hte_supervisor': {
        const hteSubQuery = hteStudentsQuery.listMyHteStudents
        const students = hteSubQuery?.data ?? []

        const internOptions = students
          .filter((u) => u.status === 'active')
          .map((u) => ({
            ...u,
            name: formatFullNameFromPayload(u.student_profiles?.profiles),
          }))

        const internMap = Object.fromEntries(
          students.map((u) => [u.id, formatFullNameFromPayload(u.student_profiles?.profiles)]),
        )

        return {
          evaluations: myEvaluationsQuery.data ?? [],
          internOptions,
          internMap,
          isLoading: myEvaluationsQuery.isLoading || Boolean(hteSubQuery?.isLoading),
          isError: myEvaluationsQuery.isError || Boolean(hteSubQuery?.isError),
          error: myEvaluationsQuery.error || hteSubQuery?.error,
          refetch: () => {
            myEvaluationsQuery.refetch()
            hteSubQuery?.refetch()
          },
        }
      }

      case 'faculty_adviser': {
        const students = facultyStudentsQuery.data ?? []

        const internOptions = students
          .filter((u) => u.currentInternship?.status === 'active')
          .map((u) => ({
            ...u,
            id: u.currentInternship?.id,
            name: formatFullNameFromPayload(u.profiles),
          }))

        const internMap = Object.fromEntries(
          students.map((u) => [u.currentInternship?.id, formatFullNameFromPayload(u.profiles)]),
        )

        return {
          evaluations: myEvaluationsQuery.data ?? [],
          internOptions,
          internMap,
          isLoading: myEvaluationsQuery.isLoading || facultyStudentsQuery.isLoading,
          isError: myEvaluationsQuery.isError || facultyStudentsQuery.isError,
          error: myEvaluationsQuery.error || facultyStudentsQuery.error,
          refetch: () => {
            myEvaluationsQuery.refetch()
            facultyStudentsQuery.refetch()
          },
        }
      }

      case 'student': {
        const students = user ? [user] : []
        const internMap = Object.fromEntries(
          students.map((u) => [
            u.id,
            [u.lastName, u.firstName, u.middleName, u.suffix].filter(Boolean).join(' '),
          ]),
        )

        return {
          evaluations: internEvaluationsQuery.data ?? [],
          internOptions: null,
          internMap,
          isLoading: internEvaluationsQuery.isLoading,
          isError: internEvaluationsQuery.isError,
          error: internEvaluationsQuery.error,
          refetch: internEvaluationsQuery.refetch,
        }
      }

      default:
        return {
          evaluations: [],
          internOptions: null,
          internMap: {},
          isLoading: false,
          isError: false,
          error: null,
          refetch: () => {},
        }
    }
  }, [
    currentUserRole,
    user,
    myEvaluationsQuery,
    hteStudentsQuery.listMyHteStudents,
    facultyStudentsQuery,
    internEvaluationsQuery,
  ])
}
