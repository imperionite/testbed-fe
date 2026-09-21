import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useInternships } from './useInternshipMutations'
import { internshipsApi } from '../../../api/internships'
import { usersApi } from '../../../api/users'

export function useInternshipsData() {
  const internshipsQuery = useInternships()

  const studentsQuery = useQuery({
    queryKey: ['users', 'student'],
    queryFn: () => usersApi.getUsersByRole('student'),
  })

  const advisersQuery = useQuery({
    queryKey: ['users', 'faculty_adviser'],
    queryFn: () => usersApi.getUsersByRole('faculty_adviser'),
  })

  const internshipMeQuery = useQuery({
    queryKey: ['internship'],
    queryFn: internshipsApi.getOwnInternship,
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
    isLoading: internshipsQuery.isLoading || studentsQuery.isLoading || advisersQuery.isLoading,
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
