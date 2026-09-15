import { useQuery } from '@tanstack/react-query'
import { documentsApi } from '../../../api/documents'

export function useDocuments(internshipId, options = {}) {
  return useQuery({
    queryKey: ['documents', internshipId],
    queryFn: () => documentsApi.listByInternship(internshipId),
    enabled: !!internshipId,
    ...options,
  })
}
