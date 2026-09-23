import { useState } from 'react'
import {
  Box,
  Typography,
  // Card,
  // CardContent,
  // Stack,
  // Button,
  // Chip,
  Paper,
} from '@mui/material'
// import AddIcon from '@mui/icons-material/Add'
// import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useQuery } from '@tanstack/react-query'
// import useAuth from '../../../hooks/useAuth'
import { useAttendanceByInternship, useAttendanceMutations } from '../hooks/useAttendanceMutations'
import { attendanceApi } from '../../../api/attendance'
import AttendanceTable from './AttendanceTable'
import AttendanceFormModal from './AttendanceFormModal'

export default function StudentDashboard({ internshipId }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEditRecord, setSelectedEditRecord] = useState(null)

  // 1. Fetch attendance list automatically for this student's internship
  const { data: attendance = [], isLoading: isAttendanceLoading } =
    useAttendanceByInternship(internshipId)

  // 2. Fetch validated rendered hours summary
  const {
    data: renderedHours,
    // isLoading: isHoursLoading
  } = useQuery({
    queryKey: ['renderedHours', internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId,
  })

  // 3. Mutations for logging and updating
  const { createAttendance, updateAttendance } = useAttendanceMutations(internshipId)

  const handleCreateSubmit = async (payload) => {
    await createAttendance.mutateAsync({
      internship_id: internshipId,
      ...payload,
    })
  }

  const handleEditSubmit = async (payload) => {
    if (selectedEditRecord) {
      await updateAttendance.mutateAsync({
        id: selectedEditRecord.id,
        payload,
      })
      setSelectedEditRecord(null)
    }
  }

  const handleOpenEdit = (record) => {
    setSelectedEditRecord(record)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedEditRecord(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Attendance Section */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        {isAttendanceLoading ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            Loading attendance records...
          </Typography>
        ) : (
          <AttendanceTable
            data={attendance}
            isStudent={true}
            onEdit={handleOpenEdit}
            onLogAttendance={() => {
              setSelectedEditRecord(null)
              setModalOpen(true)
            }}
            renderedHours={renderedHours?.totalHours || 0}
          />
        )}
      </Paper>

      {/* Reusable Form Modal for Create & Edit */}
      <AttendanceFormModal
        key={selectedEditRecord?.id ?? (modalOpen ? 'new' : 'closed')}
        open={modalOpen}
        onClose={handleCloseModal}
        initialData={selectedEditRecord}
        onSubmit={selectedEditRecord ? handleEditSubmit : handleCreateSubmit}
      />
    </Box>
  )
}
