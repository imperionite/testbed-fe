import { useState } from 'react'
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import CardStat from '../shared/components/CardStat'
import StudentTable from './components/StudentTable'
import StudentModal from './components/StudentModal'
import useAuth from '../../hooks/useAuth'
import { useStudents } from './hooks/useStudents'
import { useUsers } from '../users/hooks/useUsers'
import { useStudentMutations } from './hooks/useStudentMutations'
import { useStudentModalState } from './hooks/useStudentModalState'
import { getStudentManagementPermissions } from './studentPermissions'
import { MODES } from './form/formConfig'
import { useMemo } from 'react'
import { mapStudentData } from './utils/studentUtils'
import { useUiPermissions } from '../shared/hooks/useUiPermissions'
import FacultyStudentDetailsModal from './components/FacultyStudentDetailsModal'
import  notify  from '../../utils/toast'

export default function StudentManagementPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { isReadOnlyStaff } = useUiPermissions()
  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    refetch,
  } = useStudents(user?.role)
  const { data: userData = [], isLoading: isUsersLoading } = useUsers({ enabled: isReadOnlyStaff })
  const modalState = useStudentModalState()
  const { onCreate, onUpdate } = useStudentMutations()

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [viewedStudent, setViewedStudent] = useState(null)

  const handleSubmit = async (data) => {
    setError(null)
    setIsSaving(true)
    try {
      if (modalState.mode === MODES.CREATE) {
        await onCreate?.mutateAsync(data)
      } else {
        await onUpdate?.mutateAsync({
          id: modalState.selectedStudent.id,
          payload: {
            studentNumber: data.studentNumber || null,
            program: data.program || null,
            yearLevel: data.yearLevel,
            section: data.section || null,
            contactNumber: data.contactNumber || null,
            address: data.address || null,
            emergencyContactName: data.emergencyContactName || null,
            emergencyContactNumber: data.emergencyContactNumber || null,
          },
        })
      }
      setIsSaving(false)
      modalState.close()
      refetch()
    } catch (submitError) {
      setIsSaving(false)
      const errorMsg = submitError.response?.data?.message || submitError.message || 'Unable to save Student record.'
      setError(errorMsg)
      notify.error(errorMsg)
    }
  }
  

  const permissions = getStudentManagementPermissions(user?.role)

  // Merge student records with user metadata for names
  const mergedStudents = useMemo(() => {
    if (!students) return []

    const studentsArr = Array.isArray(students) ? students : [students]

    return studentsArr.map((student) => {
      const userRecord = userData?.find((u) => u.id === student.id) || student.user || {}

      return mapStudentData(student, userRecord)
    })
  }, [students, userData])

  if (isAuthLoading || isStudentsLoading || isUsersLoading) return <CircularProgress />
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
          Student Records
        </Typography>
        {permissions.canCreate && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => modalState.open(MODES.CREATE, null)}
          >
            Add Student
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          mb: 4,
        }}
      >
        <CardStat title="Total Student Records" value={mergedStudents.length} />
      </Box>

      <StudentTable
        data={mergedStudents}
        role={user?.role}
        onEdit={(student) => modalState.open(MODES.EDIT, student)}
        onView={setViewedStudent}
      />

      <FacultyStudentDetailsModal
        open={Boolean(viewedStudent)}
        student={viewedStudent}
        onClose={() => setViewedStudent(null)}
      />

      <StudentModal
        key={`${modalState.mode}-${modalState.selectedStudent?.id || 'new'}-${modalState.isOpen}`}
        open={modalState.isOpen}
        mode={modalState.mode}
        student={modalState.selectedStudent}
        permissions={permissions}
        onClose={modalState.close}
        onSubmit={handleSubmit}
        isStudent={false}
        isSaving={isSaving}
        error={error}
        availableUsers={userData.filter(
          (u) => u.role === 'student' && !mergedStudents.some((s) => s.userId === u.id),
        )}
      />
    </Box>
  )
}
