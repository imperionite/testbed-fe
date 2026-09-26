import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../../../api/students'
import { useUiPermissions } from '../../shared/hooks/useUiPermissions'

export function useStudents(role, options = {}) {
  const { isAdmin, isCoordinator, isStudent, isFacultyAdviser } = useUiPermissions()

  return useQuery(
    (() => {
      switch (true) {
        case isAdmin || isCoordinator:
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
        case isFacultyAdviser:
          return {
            queryKey: ['students', 'all'],
            queryFn: studentApi.listAssignedStudents,
            retry: 1,
            ...options,
          }
        default:
          return {
            queryKey: ['students', 'none'],
            queryFn: () => Promise.resolve([]),
            enabled: false,
            ...options,
          }
      }
    })(),
  )
}
