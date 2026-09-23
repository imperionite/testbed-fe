import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import useAuth from '../../hooks/useAuth'
import CardStat from '../shared/components/CardStat'
import EvaluationTable from './components/EvaluationTable'
import EvaluationModal from './components/EvaluationModal'
import { getEvaluationPermissions, ROLES } from './permissions'
import { MODES } from './form/evaluationConfig'
import {
  useEvaluationContext,
  toInternshipOption,
  useInternEvaluations,
} from './hooks/useEvaluations'
import { useEvaluationMutations } from './hooks/useEvaluationMutations'
import notify from '../../utils/toast'

export default function EvaluationManagementPage() {
  const { user } = useAuth()

  const role = user?.role?.toLowerCase()

  const permissions = getEvaluationPermissions(role)

  const context = useEvaluationContext(role, user)

  const {
    evaluatorQuery,
    studentEvaluationsQuery,
    hteStudents,
    hteStudentsQuery,
    facultyStudents,
    facultyStudentsQuery,
    staffInternships,
    staffInternshipsQuery,
  } = context

  const { createEvaluation, updateEvaluation, submitEvaluation } = useEvaluationMutations()

  const [modal, setModal] = useState({
    open: false,
    mode: MODES.VIEW,
    evaluation: null,
  })

  const [selectedInternshipId, setSelectedInternshipId] = useState('')

  const isEvaluator = permissions.isEvaluator
  const isStudent = permissions.isStudent
  const isReadOnlyStaff = permissions.isReadOnlyStaff

  // ------------------------------------------------------------
  // Internships available for creating evaluations
  // ------------------------------------------------------------
  const internshipOptions = useMemo(() => {
    if (role === ROLES.HTE_SUPERVISOR) {
      return hteStudents.map(toInternshipOption).filter(Boolean)
    }

    if (role === ROLES.FACULTY_ADVISER) {
      return facultyStudents
        .map((student) =>
          toInternshipOption({
            ...student,
            internship_id: student.currentInternship?.id,
          }),
        )
        .filter(Boolean)
    }

    return []
  }, [role, hteStudents, facultyStudents])

  // ------------------------------------------------------------
  // Staff evaluation query
  // ------------------------------------------------------------
  const selectedStaffEvaluationsQuery = useInternEvaluations(selectedInternshipId, isReadOnlyStaff)

  const staffEvaluations = selectedStaffEvaluationsQuery.data ?? []

  // ------------------------------------------------------------
  // Determine which evaluation dataset to display
  // ------------------------------------------------------------
  const evaluations = isEvaluator
    ? (evaluatorQuery.data ?? [])
    : isStudent
      ? (studentEvaluationsQuery.data ?? [])
      : staffEvaluations

  // ------------------------------------------------------------
  // Loading state
  // ------------------------------------------------------------
  const isLoading = isEvaluator
    ? evaluatorQuery.isLoading || hteStudentsQuery.isLoading || facultyStudentsQuery.isLoading
    : isStudent
      ? studentEvaluationsQuery.isLoading
      : staffInternshipsQuery.isLoading || selectedStaffEvaluationsQuery.isLoading

  // ------------------------------------------------------------
  // Error state
  // ------------------------------------------------------------
  const isError = isEvaluator
    ? evaluatorQuery.isError || hteStudentsQuery.isError || facultyStudentsQuery.isError
    : isStudent
      ? studentEvaluationsQuery.isError
      : staffInternshipsQuery.isError || selectedStaffEvaluationsQuery.isError

  const error =
    evaluatorQuery.error ||
    studentEvaluationsQuery.error ||
    hteStudentsQuery.error ||
    facultyStudentsQuery.error ||
    staffInternshipsQuery.error ||
    selectedStaffEvaluationsQuery.error

  // ------------------------------------------------------------
  // Internship labels
  // ------------------------------------------------------------
  const internshipLabels = useMemo(() => {
    // Admin / Coordinator
    if (isReadOnlyStaff) {
      return Object.fromEntries(
        staffInternships.map((internship) => {
          const student = internship.student_profiles ?? {}

          const name =
            [student.first_name, student.middle_name, student.last_name, student.suffix]
              .filter(Boolean)
              .join(' ') || internship.student_id

          return [internship.id, name]
        }),
      )
    }

    // HTE Supervisor / Faculty Adviser
    return Object.fromEntries(
      internshipOptions.map((option) => [option.internshipId, option.studentName]),
    )
  }, [isReadOnlyStaff, staffInternships, internshipOptions])

  // ------------------------------------------------------------
  // Modal handlers
  // ------------------------------------------------------------
  const openCreate = () => {
    setModal({
      open: true,
      mode: MODES.CREATE,
      evaluation: null,
    })
  }

  const closeModal = () => {
    setModal({
      open: false,
      mode: MODES.VIEW,
      evaluation: null,
    })
  }

  if (!permissions.canView) {
    return <Alert severity="error">You do not have permission to view evaluations.</Alert>
  }

  const draftCount = evaluations.filter((item) => item.status === 'draft').length

  const submittedCount = evaluations.filter((item) => item.status === 'submitted').length

  return (
    <Box>
      <Stack spacing={2}>
        {/* ----------------------------------------------------
            Page Header
        ----------------------------------------------------- */}
        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          justifyContent="space-between"
          alignItems={{
            xs: 'stretch',
            sm: 'center',
          }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Evaluations
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {isEvaluator
                ? 'Manage your assigned internship evaluations.'
                : isStudent
                  ? 'View submitted evaluation results for your internship.'
                  : 'View evaluation records by internship.'}
            </Typography>
          </Box>

          {permissions.canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                alignSelf: { xs: 'stretch', sm: 'center' },
              }}
            >
              New Evaluation
            </Button>
          )}
        </Stack>

        {/* ----------------------------------------------------
            Admin / Coordinator internship selector
        ----------------------------------------------------- */}
        {isReadOnlyStaff && (
          <Paper sx={{ p: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Internship"
              value={selectedInternshipId}
              onChange={(event) => setSelectedInternshipId(event.target.value)}
            >
              <MenuItem value="">
                <em>Select internship</em>
              </MenuItem>

              {staffInternships.map((internship) => (
                <MenuItem key={internship.id} value={internship.id}>
                  {internshipLabels[internship.id] ?? internship.id}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
        )}

        {/* ----------------------------------------------------
            Statistics
        ----------------------------------------------------- */}
        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          spacing={2}
        >
          <CardStat title="Total Evaluations" value={evaluations.length} />

          <CardStat title="Draft" value={draftCount} />

          <CardStat title="Submitted" value={submittedCount} />
        </Stack>

        {/* ----------------------------------------------------
            Loading
        ----------------------------------------------------- */}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">
            {error?.response?.data?.message ?? error?.message ?? 'Unable to load evaluations.'}
          </Alert>
        ) : isReadOnlyStaff && !selectedInternshipId ? (
          <Alert severity="info">Select an internship to view its evaluations.</Alert>
        ) : evaluations.length === 0 ? (
          <Alert severity="info">
            {isStudent ? 'No submitted evaluations are available yet.' : 'No evaluations found.'}
          </Alert>
        ) : (
          <EvaluationTable
            evaluations={evaluations}
            readOnly={!isEvaluator}
            onRowClick={(evaluation) => {
              setModal({
                open: true,
                mode: MODES.VIEW,
                evaluation,
              })
            }}
          />
        )}

        {/* ----------------------------------------------------
            Evaluation Modal
        ----------------------------------------------------- */}
        {permissions.canView && (
          <EvaluationModal
            open={modal.open}
            onClose={closeModal}
            mode={modal.mode}
            role={role}
            evaluation={modal.evaluation}
            internshipOptions={internshipOptions}
            onCreate={createEvaluation.mutateAsync}
            onUpdate={updateEvaluation.mutateAsync}
            onSubmitEvaluation={submitEvaluation.mutateAsync}
            onSuccess={notify.success}
          />
        )}
      </Stack>
    </Box>
  )
}
