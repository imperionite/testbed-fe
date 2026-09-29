import { useState } from 'react'
import { Box, Alert, Button, Grid } from '@mui/material'
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
import notify from '../../utils/toast'
import PageTitleAndSubtitle from '../shared/components/PageTitleAndSubtitle'

export default function StudentManagementPage() {
  const { user } = useAuth()
  const { isReadOnlyStaff, isFacultyAdviser } = useUiPermissions()
  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    refetch,
  } = useStudents(user?.role)
  const {
    data: userData = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useUsers({ enabled: isReadOnlyStaff })
  const modalState = useStudentModalState()
  const { onCreate, onUpdate } = useStudentMutations()

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [viewedStudent, setViewedStudent] = useState(null)

  const hasError = isStudentsError || isUsersError
  const activeError = studentsError || usersError

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
      const errorMsg =
        submitError.response?.data?.message ||
        submitError.message ||
        'Unable to save Student record.'
      setError(errorMsg)
      notify.error(errorMsg)
    } finally {
      setIsSaving(false)
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

  // if (isAuthLoading || isStudentsLoading || isUsersLoading) return <CircularProgress />
  // if (!permissions.canView) return <Typography color="error">Access denied.</Typography>
  // if (isStudentsError)
  //   return (
  //     <Box sx={{ p: 3 }}>
  //       <Alert severity="error">
  //         <Typography variant="h6">Error Loading Students</Typography>
  //         {studentsError?.message ||
  //           'An unexpected error occurred while fetching student records. Please contact your system administrator.'}
  //         <Box sx={{ mt: 2 }}>
  //           <Button variant="outlined" color="inherit" onClick={refetch}>
  //             Retry
  //           </Button>
  //         </Box>
  //       </Alert>
  //     </Box>
  //   )

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2,
          width: '100%',
        }}
      >
        <PageTitleAndSubtitle
          title="Student Records"
          subtitle={
            isReadOnlyStaff
              ? 'Manage student records and related information.'
              : isFacultyAdviser
                ? "View your assigned students' records."
                : ' '
          }
        />
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

      {/* Stats Cards */}
      <Grid container spacing={1} sx={{ mb: { xs: 2.5, lg: 3 } }}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4.5,
            lg: 2.5,
          }}
        >
          <CardStat title="Total Student Records" value={mergedStudents.length} />
        </Grid>
      </Grid>

      {/* Error Banner */}
      {hasError ? (
        <Alert
          severity="error"
          onClose={refetch}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          {activeError?.message || 'Failed to load records.'}
        </Alert>
      ) : (
        <StudentTable
          isLoading={isStudentsLoading || isUsersLoading}
          data={mergedStudents}
          role={user?.role}
          onEdit={(student) => modalState.open(MODES.EDIT, student)}
          onView={setViewedStudent}
        />
      )}

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
