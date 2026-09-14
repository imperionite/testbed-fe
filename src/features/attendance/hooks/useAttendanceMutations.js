import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '../../../api/attendance'

export function useAttendanceByInternship(internshipId, options = {}) {
  return useQuery({
    queryKey: ['attendance', internshipId],
    queryFn: () => attendanceApi.getAttendanceByInternship(internshipId),
    enabled: !!internshipId,
    ...options,
  })
}

export function useAttendanceMutations(internshipId) {
  const queryClient = useQueryClient()
  const invalidateAttendance = () =>
    queryClient.invalidateQueries({ queryKey: ['attendance', internshipId] })

  const createAttendance = useMutation({
    mutationFn: (payload) => attendanceApi.createAttendance(payload),
    onSuccess: invalidateAttendance,
  })

  const updateAttendance = useMutation({
    mutationFn: ({ id, payload }) => attendanceApi.updateAttendance(id, payload),
    onSuccess: invalidateAttendance,
  })

  const validateAttendance = useMutation({
    mutationFn: ({ id, validationStatus }) =>
      attendanceApi.validateAttendance(id, validationStatus),
    onSuccess: invalidateAttendance,
  })

  return {
    createAttendance,
    updateAttendance,
    validateAttendance,
  }
}
