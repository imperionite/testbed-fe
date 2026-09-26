import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useInternships } from './useInternshipMutations'
import { internshipsApi } from '../../../api/internships'
import { usersApi } from '../../../api/users'
import { useUiPermissions } from '../../shared/hooks/useUiPermissions'

export function useInternshipsData() {
  const { isStudent, isReadOnlyStaff } = useUiPermissions()
  const internshipsQuery = useInternships()

  const studentsQuery = useQuery({
    queryKey: ['users', 'student'],
    queryFn: () => usersApi.getUsersByRole('student'),
    enabled: isReadOnlyStaff,
  })

  const advisersQuery = useQuery({
    queryKey: ['users', 'faculty_adviser'],
    queryFn: () => usersApi.getUsersByRole('faculty_adviser'),
    enabled: isReadOnlyStaff,
  })

  const internshipMeQuery = useQuery({
    queryKey: ['internship', 'me'],
    queryFn: internshipsApi.getOwnInternship,
    enabled: isStudent,
  })

  const studentMap = useMemo(() => {
    if (!studentsQuery.data) return {}
    return studentsQuery.data.reduce((acc, student) => {
      acc[student.id] = student
      return acc
    }, {})
  }, [studentsQuery.data])

  const adviserMap = useMemo(() => {
    if (!advisersQuery.data) return {}
    return advisersQuery.data.reduce((acc, adviser) => {
      acc[adviser.id] = adviser
      return acc
    }, {})
  }, [advisersQuery.data])

  return {
    internships: internshipsQuery.data || [],
    internshipMe: internshipMeQuery.data || [],
    studentMap,
    adviserMap,
    isLoading: internshipsQuery.isLoading || studentsQuery.isLoading || advisersQuery.isLoading || internshipMeQuery.isLoading,
    isError: internshipsQuery.isError || studentsQuery.isError || advisersQuery.isError,
    refetch: internshipsQuery.refetch,
  }
}

export function useInternshipMe(options = {}) {
  return useQuery({
    queryKey: ['internship', 'me'],
    queryFn: internshipsApi.getOwnInternship,
    ...options,
  })
}
