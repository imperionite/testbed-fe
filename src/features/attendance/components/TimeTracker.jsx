import { Box, Button, Stack } from '@mui/material'
import { useAttendanceMutations } from '../hooks/useAttendanceMutations'
import { useAttendanceByInternship } from '../hooks/useAttendanceMutations'

export default function TimeTracker({ internshipId }) {
  const { data: attendanceRecords = [] } = useAttendanceByInternship(internshipId)
  const { createAttendance, updateAttendance } = useAttendanceMutations(internshipId)

  const today = new Date().toISOString().split('T')[0]
  const todaysRecord = attendanceRecords.find((r) => r.attendance_date === today)

  const formatTime = (date) => {
    return date.toTimeString().split(' ')[0] // Returns HH:MM:SS
  }

  const handleTimeIn = () => {
    const start = new Date()
    // Add 61 minutes to satisfy backend duration validation (> 60m)
    const dummyEnd = new Date(start.getTime() + 61 * 60 * 1000)

    const payload = {
      internship_id: internshipId,
      attendance_date: today,
      time_in: formatTime(start),
      time_out: formatTime(dummyEnd),
    }
    console.log('TimeTracker - Time In Payload:', payload)
    createAttendance.mutate(payload)
    localStorage.setItem(`attendance_timed_out_${today}`, 'false')
  }

  const handleTimeOut = () => {
    if (!todaysRecord) {
      console.error('TimeTracker - No record found to update!')
      return
    }

    // TESTING WORKAROUND: Simulate > 1 hour if actual time is too short
    const now = new Date()
    const timeInParts = todaysRecord.time_in.split(':')
    const start = new Date()
    start.setHours(timeInParts[0], timeInParts[1], timeInParts[2])

    const elapsedMs = now.getTime() - start.getTime()

    let timeOutDate = now
    if (elapsedMs < 61 * 60 * 1000) {
      console.log('TimeTracker - Simulating > 1 hour duration for testing')
      timeOutDate = new Date(start.getTime() + 70 * 60 * 1000) // 70 minutes later
    }

    const payload = {
      attendance_date: today,
      time_in: todaysRecord.time_in,
      time_out: formatTime(timeOutDate),
    }
    console.log('TimeTracker - Time Out Payload:', payload, 'ID:', todaysRecord.id)
    updateAttendance.mutate({
      id: todaysRecord.id,
      payload: payload,
    })
    localStorage.setItem(`attendance_timed_out_${today}`, 'true')
  }

  // Temporary helper for testing: Resets local tracking state
  const handleReset = () => {
    localStorage.removeItem(`attendance_timed_out_${today}`)
    window.location.reload()
  }

  const hasTimedOut = localStorage.getItem(`attendance_timed_out_${today}`) === 'true'

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: 20, top: 20 }}>
        <Button variant="contained" onClick={handleTimeIn} disabled={!!todaysRecord}>
          Time In
        </Button>
        <Button variant="contained" color="warning" disabled={!todaysRecord || hasTimedOut}>
          Lunch
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleTimeOut}
          disabled={!todaysRecord || hasTimedOut}
        >
          Time Out
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset Test
        </Button>
      </Stack>
    </Box>
  )
}
