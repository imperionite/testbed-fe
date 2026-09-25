import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material'
import CardStat from '../shared/components/CardStat'
import useAuth from '../../hooks/useAuth'
import { useMyHteStudents } from '../htes/hooks/useHtes'
import { useModalState } from './hooks/useModalState'
import HteInternshipTable from './components/HteInternshipTable'
import HteInternshipDetailsModal from './components/HteInternshipDetailsModal'
import { MODES } from '../students/form/formConfig'

export default function HteStudentsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    refetch,
  } = useMyHteStudents(user?.role)

  const modalState = useModalState()

  const permissions = 
    {
      canView: true,
      canEdit: false,
      canUpdate: false
    };

  if (isAuthLoading || isStudentsLoading) return <CircularProgress />
  if (!permissions.canView) return <Typography color="error">Access denied.</Typography>
  if (isStudentsError)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Error Loading Students</Typography>
          {studentsError?.message ||
            'An unexpected error occurred while fetching student records. Please contact your system administrator.'}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="inherit" onClick={refetch}>
              Retry
            </Button>
          </Box>
        </Alert>
      </Box>
    )

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Internship Records
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          mb: 4,
        }}
      >
        <CardStat title="Total Internship Records" value={students.length} />
        <CardStat title="Pending Internships" value={students.filter(student => student.status === "pending").length} /> 
        <CardStat title="Active Internships" value={students.filter(student => student.status === "active").length} /> 
      </Box>

      <HteInternshipTable
        data={students}
        role={user?.role}
        onView={(student) => modalState.open(MODES.VIEW, student)}
      />

    <HteInternshipDetailsModal
      open={modalState.isOpen}
      student={modalState.selectedEntity}
      onClose={modalState.close}
    />
    </Box>
  )
}
