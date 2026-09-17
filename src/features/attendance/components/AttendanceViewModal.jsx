import { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAttendanceByInternship, useAttendanceMutations } from '../hooks/useAttendanceMutations'
import { attendanceApi } from '../../../api/attendance'
import { useQuery } from '@tanstack/react-query'
import AttendanceTable from './AttendanceTable'
import AttendanceValidationForm from './AttendanceValidationForm'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export default function AttendanceViewModal({ open, onClose, internshipId }) {
  const { data: attendance = [], isLoading: isAttendanceLoading } =
    useAttendanceByInternship(internshipId)
  
  const { validateAttendance } = useAttendanceMutations(internshipId)

  const { data: renderedHours, isLoading: isHoursLoading } = useQuery({
    queryKey: ['renderedHours', internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId,
  })

  const [validationData, setValidationData] = useState(null)

  const handleValidate = (attendanceRecord) => {
    setValidationData(attendanceRecord)
  }

  const handleValidationSubmit = async (data) => {
    await validateAttendance.mutateAsync({
        id: validationData.id,
        validationStatus: data.validation_status
    })
    setValidationData(null)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Attendance Records</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Total Validated Hours: {isHoursLoading ? 'Loading...' : renderedHours?.totalHours || 0}
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
          <AttendanceTable data={attendance} onValidate={handleValidate} />
        )}
      </Box>
    </Modal>
  )
}
