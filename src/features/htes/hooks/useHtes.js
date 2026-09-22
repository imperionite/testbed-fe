import { useQuery } from '@tanstack/react-query'

import { htesApi } from '../../../api/htes'

export function useHtes(options = {}) {
  const listHtes = useQuery({
    queryKey: ['htes'],
    queryFn: htesApi.listHtes,
    ...(options.listHtes || {}),
  })

  const listMyHteStudents = useQuery({
    queryKey: ['my-htes-students'],
    queryFn: htesApi.getMyHteStudents,
    ...(options.listMyHteStudents || {}),
  })

  return {
    data: listHtes.data,
    isLoading: listHtes.isLoading,
    isError: listHtes.isError,
    error: listHtes.error,
    refetch: listHtes.refetch,
    listHtes,
    listMyHteStudents,
  }
}
