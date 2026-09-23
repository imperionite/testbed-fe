import { Box, Typography } from '@mui/material'
import { StudentDocumentsView } from '../features/documents'
import useAuth from '../hooks/useAuth'
import { useStudents } from '../features/students/hooks/useStudents'

export default function StudentDocumentsPage() {
  const { user } = useAuth()
  const { data: studentProfile } = useStudents(user?.role)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Documents
      </Typography>
      {studentProfile?.currentInternship?.id ? (
        <StudentDocumentsView internshipId={studentProfile.currentInternship.id} />
      ) : (
        <Typography>No active internship found.</Typography>
      )}
    </Box>
  )
}
