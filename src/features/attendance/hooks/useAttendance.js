import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '../../../api/attendance'

export function useRenderedHours(internshipId, options = {}) {
  return useQuery({
    queryKey: ['attendance','renderedHours', internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId,
    ...options,
  })
}