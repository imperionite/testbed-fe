import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '../../../api/attendance'
import notify from '../../../utils/toast'

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
    onSuccess: () => {
      notify.success("Attendance logged successfully")
      invalidateAttendance()
    },
    onError: (error) => {
      notify.error(error.message || "Failed to log attendance")
    },
  })

  const updateAttendance = useMutation({
    mutationFn: ({ id, payload }) => attendanceApi.updateAttendance(id, payload),
    onSuccess: () => {
      notify.success("Attendance updated successfully")
      invalidateAttendance()
    },
    onError: (error) => {
      notify.error(error.message || "Failed to update attendance")
    },
  })

  const validateAttendance = useMutation({
    mutationFn: ({ id, validationStatus }) =>
      attendanceApi.validateAttendance(id, validationStatus),
    onSuccess: () => {
      notify.success("Attendance validation status updated")
      invalidateAttendance()
    },
    onError: (error) => {
      notify.error(error.message || "Failed to update validation status")
    },
  })

  return {
    createAttendance,
    updateAttendance,
    validateAttendance,
  }
}
