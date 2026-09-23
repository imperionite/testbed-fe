import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../../../api/students'

export function useStudents(role, options = {}) {
  const isStaff = ['administrator', 'internship_coordinator', 'hte_supervisor'].includes(role)
  const isStudent = ['student'].includes(role)
  const isAdviser = ['faculty_adviser'].includes(role)

  return useQuery(
    (() => {
      switch (true) {
        case isStaff:
          return {
            queryKey: ['students', 'all'],
            queryFn: studentApi.listStudents,
            retry: 1,
            ...options,
          }
        case isStudent:
          return {
            queryKey: ['students', 'me'],
            queryFn: studentApi.getMyProfile,
            retry: 1,
            ...options,
          }
        case isAdviser:
          return {
            queryKey: ['students', 'all'],
            queryFn: studentApi.listAssignedStudents,
            retry: 1,
            ...options,
          }
        default:
          throw new Error(`Unknown role: ${role}`)
      }
    })(),
  )
}
