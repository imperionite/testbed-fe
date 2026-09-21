import { useQuery } from '@tanstack/react-query'

import { usersApi } from '../../../api/users'

export function useUsers(options = {}) {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.listUsers,
    ...options,
  })
}

export function useStudentUsers(options = {}) {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsersByRole('students'),
    ...options,
  })
}

export function useFacultyUsers(options = {}) {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsersByRole('faculty_adviser'),
    ...options,
  })
}

export function useSupervisorUsers(options = {}) {
  return useQuery({
    queryKey: ['users', 'hte_supervisor'],
    queryFn: () => usersApi.getUsersByRole('hte_supervisor'),
    ...options,
  })
}

