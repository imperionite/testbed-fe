import { useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAttendanceMutations } from '../hooks/useAttendanceMutations'
import AttendanceFormModal from './AttendanceFormModal'

export default function TimeTracker({ internshipId }) {
  const { createAttendance } = useAttendanceMutations(internshipId)
  const [modalOpen, setModalOpen] = useState(false)

  const handleFormSubmit = (payload) => {
    createAttendance.mutate({
      internship_id: internshipId,
      ...payload,
    })
  }

  return (
    <Box>
      <Stack direction="row" spacing={1.5}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Log Attendance / Time Record
        </Button>
      </Stack>

      <AttendanceFormModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleFormSubmit}
      />
    </Box>
  )
}
