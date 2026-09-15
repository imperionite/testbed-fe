import { Box, Button, Stack } from '@mui/material'
import { useAttendanceMutations } from '../hooks/useAttendanceMutations'
import { useAttendanceByInternship } from '../hooks/useAttendanceMutations'

export default function TimeTracker({ internshipId }) {
  const { data: attendanceRecords = [] } = useAttendanceByInternship(internshipId)
  const { createAttendance, updateAttendance } = useAttendanceMutations(internshipId)

  const today = new Date().toISOString().split('T')[0]
  const todaysRecord = attendanceRecords.find((r) => r.attendance_date === today)

  const handleTimeIn = () => {
    createAttendance.mutate({
      internship_id: internshipId,
      attendance_date: today,
      time_in: new Date().toISOString(),
      time_out: null,
    })
  }

  const handleTimeOut = () => {
    updateAttendance.mutate({
      id: todaysRecord.id,
      payload: {
        time_out: new Date().toISOString(),
      },
    })
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: 20, top: 20 }}>
        <Button variant="contained" onClick={handleTimeIn} disabled={!!todaysRecord}>
          Time In
        </Button>
        <Button
          variant="contained"
          color="warning"
          disabled={!todaysRecord || todaysRecord.time_out}
        >
          Lunch
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleTimeOut}
          disabled={!todaysRecord || todaysRecord.time_out}
        >
          Time Out
        </Button>
      </Stack>
    </Box>
  )
}
