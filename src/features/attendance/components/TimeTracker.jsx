import { useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAttendanceMutations } from '../hooks/useAttendanceMutations'
import AttendanceFormModal from './AttendanceFormModal'

export default function TimeTracker({ internshipId }) {
  const { createAttendance } = useAttendanceMutations(internshipId)
  const [modalOpen, setModalOpen] = useState(false)

  const handleFormSubmit = async (payload) => {
    await createAttendance.mutateAsync({
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
          disabled={createAttendance.isPending}
        >
          Log Attendance / Time Record
        </Button>
      </Stack>

      <AttendanceFormModal
        key={modalOpen ? 'open' : 'closed'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createAttendance.isPending}
      />
    </Box>
  )
}
