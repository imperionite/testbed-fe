import { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAttendanceByInternship, useAttendanceMutations } from '../hooks/useAttendanceMutations'
import { attendanceApi } from '../../../api/attendance'
import { useQuery } from '@tanstack/react-query'
import AttendanceTable from './AttendanceTable'
import AttendanceValidationForm from './AttendanceValidationForm'
import AttendanceFormModal from './AttendanceFormModal'
import useAuth from '../../../hooks/useAuth'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}

export default function AttendanceViewModal({ open, onClose, internshipId }) {
  const { user } = useAuth()
  const isStudent = user?.role === 'student'

  const { data: attendance = [], isLoading: isAttendanceLoading } =
    useAttendanceByInternship(internshipId)

  const { validateAttendance, updateAttendance } = useAttendanceMutations(internshipId)

  const { data: renderedHours, isLoading: isHoursLoading } = useQuery({
    queryKey: ['renderedHours', internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId,
  })

  const [validationData, setValidationData] = useState(null)
  const [selectedEditRecord, setSelectedEditRecord] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleValidate = (attendanceRecord) => {
    setValidationData(attendanceRecord)
  }

  const handleEdit = (attendanceRecord) => {
    setSelectedEditRecord(attendanceRecord)
    setEditModalOpen(true)
  }

  const handleValidationSubmit = async (data) => {
    await validateAttendance.mutateAsync({
      id: validationData.id,
      validationStatus: data.validation_status,
    })
    setValidationData(null)
  }

  const handleEditSubmit = async (payload) => {
    await updateAttendance.mutateAsync({
      id: selectedEditRecord.id,
      payload,
    })
    setSelectedEditRecord(null)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Attendance Records & History
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="primary" fontWeight={600}>
            Total Validated Hours:{' '}
            {isHoursLoading
              ? 'Loading...'
              : `${Number(renderedHours?.totalHours || 0).toFixed(2)} hrs`}
          </Typography>
        </Box>

        {validationData ? (
          <AttendanceValidationForm
            attendance={validationData}
            mode="VALIDATE"
            onSubmit={handleValidationSubmit}
            onCancel={() => setValidationData(null)}
          />
        ) : isAttendanceLoading ? (
          <Typography>Loading attendance...</Typography>
        ) : (
          <AttendanceTable
            data={attendance}
            onValidate={handleValidate}
            onEdit={handleEdit}
            isStudent={isStudent}
          />
        )}

        {editModalOpen && (
          <AttendanceFormModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialData={selectedEditRecord}
            onSubmit={handleEditSubmit}
          />
        )}
      </Box>
    </Modal>
  )
}
