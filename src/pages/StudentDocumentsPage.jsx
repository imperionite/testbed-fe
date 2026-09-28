import { useMemo, useState } from 'react'
import { Box, Typography, TextField, MenuItem, CircularProgress, Alert, Stack } from '@mui/material'
import { StudentDocumentsView, CoordinatorDocumentsView } from '../features/documents'
import useAuth from '../hooks/useAuth'
import { useStudents } from '../features/students/hooks/useStudents'
import { useUiPermissions } from '../features/shared/hooks/useUiPermissions'
import { useQuery } from '@tanstack/react-query'
import { htesApi } from '../api/htes'
import { internshipsApi } from '../api/internships'
import { usersApi } from '../api/users'
import { studentApi } from '../api/students'
import { toInternshipOption } from '../features/evaluations/hooks/useEvaluations'

export default function StudentDocumentsPage() {
  const { user } = useAuth()
  const { isStudent, isHteSupervisor, isFacultyAdviser, isReadOnlyStaff } = useUiPermissions()

  // 1. Student profile query
  const {
    data: studentProfile,
    isLoading: isStudentLoading,
    isError: isStudentError,
  } = useStudents(user?.role)

  // 2. HTE Supervisor students query
  const hteStudentsQuery = useQuery({
    queryKey: ['htes', 'my', 'students'],
    queryFn: htesApi.getMyHteStudents,
    enabled: isHteSupervisor,
  })

  // 3. Faculty Adviser students query
  const facultyStudentsQuery = useQuery({
    queryKey: ['students', 'assigned'],
    queryFn: studentApi.listAssignedStudents,
    enabled: isFacultyAdviser,
  })

  // 4. Staff internships & students query
  const staffInternshipsQuery = useQuery({
    queryKey: ['internships', 'all'],
    queryFn: internshipsApi.listInternships,
    enabled: isReadOnlyStaff,
  })

  const { data: allStudents = [] } = useQuery({
    queryKey: ['users', 'student'],
    queryFn: () => usersApi.getUsersByRole('student'),
    enabled: isReadOnlyStaff,
  })

  const studentMap = useMemo(() => {
    return allStudents.reduce((acc, student) => {
      acc[student.id] = student
      return acc
    }, {})
  }, [allStudents])

  const [selectedInternshipId, setSelectedInternshipId] = useState('')

  // Build internship options for evaluators/staff
  const internshipOptions = useMemo(() => {
    if (isHteSupervisor) {
      return (hteStudentsQuery.data ?? []).map(toInternshipOption).filter(Boolean)
    }
    if (isFacultyAdviser) {
      return (facultyStudentsQuery.data ?? [])
        .map((student) =>
          toInternshipOption({
            ...student,
            internship_id: student.currentInternship?.id,
          }),
        )
        .filter(Boolean)
    }
    if (isReadOnlyStaff) {
      return (staffInternshipsQuery.data ?? [])
        .map((internship) => {
          const student = studentMap[internship.student_id] ?? {}
          const profile = student.profiles ?? student
          const studentName =
            [profile.first_name, profile.middle_name, profile.last_name, profile.suffix]
              .filter(Boolean)
              .join(' ') || internship.student_id

          return {
            internshipId: internship.id,
            studentName,
          }
        })
        .filter(Boolean)
    }
    return []
  }, [
    isHteSupervisor,
    isFacultyAdviser,
    isReadOnlyStaff,
    hteStudentsQuery.data,
    facultyStudentsQuery.data,
    staffInternshipsQuery.data,
    studentMap,
  ])

  const currentSelectionId = selectedInternshipId || internshipOptions[0]?.internshipId || ''

  if (isStudent) {
    if (isStudentLoading) return <CircularProgress />
    if (isStudentError) return <Alert severity="error">Failed to load student profile.</Alert>

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

  // Evaluator / Staff view
  const isLoading =
    hteStudentsQuery.isLoading || facultyStudentsQuery.isLoading || staffInternshipsQuery.isLoading

  if (isLoading) return <CircularProgress />

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Internship Documents Management
      </Typography>

      {internshipOptions.length === 0 ? (
        <Typography>No active internship found.</Typography>
      ) : (
        <Stack spacing={3}>
          <TextField
            select
            label="Select Intern / Internship"
            value={currentSelectionId}
            onChange={(e) => setSelectedInternshipId(e.target.value)}
            sx={{ maxWidth: 400 }}
          >
            {internshipOptions.map((option) => (
              <MenuItem key={option.internshipId} value={option.internshipId}>
                {option.studentName}
              </MenuItem>
            ))}
          </TextField>

          {currentSelectionId ? (
            <CoordinatorDocumentsView internshipId={currentSelectionId} />
          ) : (
            <Typography>No active internship selected.</Typography>
          )}
        </Stack>
      )}
    </Box>
  )
}
