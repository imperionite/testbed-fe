import { Alert, Button, CircularProgress, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import CardStat from '../shared/components/CardStat'
import EvaluationTable from './components/EvaluationTable'
import EvaluationModal from './components/EvaluationModal'
import { useEvaluationModalState } from './hooks/useEvaluationsModalState'
import useAuth from '../../hooks/useAuth'
import { useEvaluations, useInternEvaluations } from './hooks/useEvaluations'
import { useEvaluationMutations } from './hooks/useEvaluationMutations'
import { getEvaluationManagementPermissions } from './evaluationPermissions'
import notify from '../../utils/toast'
import { useHtes } from '../htes/hooks/useHtes'
import { useStudents } from '../students/hooks/useStudents'
import { MODES } from './form/formConfig'
// import { useInternshipMe } from '../internships/hooks/useInternshipsData'

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  cardsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    width: '100%',
  },
  mainSection: {
    paddingTop: '10px',
  },
  tableHeader: {
    marginBottom: '16px',
  },
  tableContainer: {
    width: '100%',
  },
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function EvaluationManagementPage() {
  const { user } = useAuth()
  const permissions = getEvaluationManagementPermissions(user?.role)
  const isHteSupervisorOrFacultyAdviser = permissions.canViewMyEvaluationsList

  const currentUserRole = user?.role?.toLowerCase()

  const criteriaList = [
    'Knowledge of Assigned Tasks',
    'Quality of Work',
    'Productivity',
    'Problem-Solving',
    'Communication',
    'Teamwork',
    'Professionalism',
    'Adaptability',
  ]

  // Query for evaluation records
  const myEvaluationsQuery = useEvaluations({
    enabled: isHteSupervisorOrFacultyAdviser,
  })
  // const myInternship = useInternshipMe({
  //   enabled: currentUserRole === 'student',
  // })

  // Get student profile to extract internship ID
  const myStudentProfile = useStudents(currentUserRole, {
    enabled: currentUserRole === 'student',
  })
  const internshipId = myStudentProfile.data?.currentInternship?.id

  // Query for intern evaluations
  const internEvaluationsQuery = useInternEvaluations(internshipId, {
    enabled: !!internshipId,
  })

  // Query for student records
  const hteStudentsQuery = useHtes({
    listMyHteStudents: { enabled: Boolean(currentUserRole === 'hte_supervisor') },
  })
  const facultyStudentsQuery = useStudents(currentUserRole, {
    enabled: currentUserRole === 'faculty_adviser',
  })

  // Query and payload extraction config based on user role
  // internOptions -> for intern dropdown in modal
  // internMap -> for mapping of intern names in table
  let evaluations, students, internMap, isLoading, isError, error, refetch, internOptions

  switch (currentUserRole) {
    case 'hte_supervisor':
      evaluations = myEvaluationsQuery.data ?? []
      students = hteStudentsQuery.listMyHteStudents?.data ?? []

      internOptions = students
        .filter((u) => u.status === 'active')
        .map((u) => ({
          ...u,
          name: [
            u.student_profiles?.profiles?.last_name,
            u.student_profiles?.profiles?.first_name,
            u.student_profiles?.profiles?.middle_name,
            u.student_profiles?.profiles?.suffix,
          ]
            .filter(Boolean)
            .join(' '),
        }))

      internMap = Object.fromEntries(
        students.map((u) => [
          u.id,
          [
            u.student_profiles?.profiles?.last_name,
            u.student_profiles?.profiles?.first_name,
            u.student_profiles?.profiles?.middle_name,
            u.student_profiles?.profiles?.suffix,
          ]
            .filter(Boolean)
            .join(' '),
        ]),
      )

      isLoading = myEvaluationsQuery.isLoading || hteStudentsQuery.listMyHteStudents?.isLoading
      isError = myEvaluationsQuery.isError || hteStudentsQuery.listMyHteStudents?.isError
      error = myEvaluationsQuery.error || hteStudentsQuery.listMyHteStudents?.error
      refetch = () => {
        myEvaluationsQuery.refetch()
        hteStudentsQuery.listMyHteStudents?.refetch()
      }
      break

    case 'faculty_adviser':
      evaluations = myEvaluationsQuery.data ?? []
      students = facultyStudentsQuery.data ?? []

      internOptions = students
        .filter((u) => {
          return u.currentInternship?.status === 'active'
        })
        .map((u) => ({
          ...u,
          id: u.currentInternship.id,
          name: [
            u.profiles.last_name,
            u.profiles.first_name,
            u.profiles.middle_name,
            u.profiles.suffix,
          ]
            .filter(Boolean)
            .join(' '),
        }))

      internMap = Object.fromEntries(
        students.map((u) => {
          const name = [
            u.profiles.last_name,
            u.profiles.first_name,
            u.profiles.middle_name,
            u.profiles.suffix,
          ]
            .filter(Boolean)
            .join(' ')
          return [u.currentInternship.id, name]
        }),
      )

      isLoading = myEvaluationsQuery.isLoading || facultyStudentsQuery.isLoading
      isError = myEvaluationsQuery.isError || facultyStudentsQuery.isError
      error = myEvaluationsQuery.error || facultyStudentsQuery.error
      refetch = () => {
        myEvaluationsQuery.refetch()
        facultyStudentsQuery.refetch()
      }
      break

    case 'student':
      evaluations = internEvaluationsQuery.data ?? []
      students = user ? [user] : []
      internOptions = null
      internMap = Object.fromEntries(
        students.map((u) => [
          u.id,
          [u.lastName, u.firstName, u.middleName, u.suffix].filter(Boolean).join(' '),
        ]),
      )

      isLoading = internEvaluationsQuery.isLoading
      isError = internEvaluationsQuery.isError
      error = internEvaluationsQuery.error
      refetch = internEvaluationsQuery.refetch
      break
    default:
      evaluations = []
      students
      internOptions = null
      internMap = {}
      isLoading = false
      isError = false
      error = null
      refetch = () => {}
      break
  }

  const modalState = useEvaluationModalState()
  const { createEvaluation, updateEvaluation, bulkSubmitEvaluations } = useEvaluationMutations()

  return (
    <div style={styles.container}>
      {/* ==================== TOP SECTION ==================== */}
      <div style={styles.topSection}>
        {/* Header: Title + Action Button */}
        <div style={styles.headerSection}>
          <Typography variant="h5" fontWeight={600}>
            Evaluations
          </Typography>
          {permissions.canCreate && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => modalState.open('create')}
            >
              New Evaluation
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div style={styles.cardsSection}>
          <CardStat title="Total Evaluations" value={evaluations?.length || 0} />
          <CardStat
            title="Draft Evaluations"
            value={evaluations?.filter((evaluation) => evaluation.status === 'draft').length || 0}
          />
          <CardStat
            title="Submitted Evaluations"
            value={
              evaluations?.filter((evaluation) => evaluation.status === 'submitted').length || 0
            }
          />
        </div>
      </div>

      {/* ==================== MAIN SECTION ==================== */}
      <div style={styles.mainSection}>
        {/* Table Header */}
        <div style={styles.tableHeader}></div>

        {/* Data Table */}
        <div style={styles.tableContainer}>
          {!permissions.canView ? (
            <Alert severity="error">You do not have permission to view evaluations.</Alert>
          ) : isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '32px',
              }}
            >
              <CircularProgress size={28} />
            </div>
          ) : isError ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={refetch}>
                  Retry
                </Button>
              }
            >
              {error?.response?.data?.message || 'Unable to load evaluations. Please try again.'}
            </Alert>
          ) : evaluations.length === 0 ? (
            <Alert
              severity="info"
              action={
                permissions.canCreate ? (
                  <Button color="inherit" size="small" onClick={() => modalState.open('create')}>
                    New Evaluation
                  </Button>
                ) : undefined
              }
            >
              No evaluations found.
            </Alert>
          ) : (
            <EvaluationTable
              evaluations={evaluations}
              permissions={permissions}
              internMap={internMap}
              onBulkStatusChange={bulkSubmitEvaluations.mutateAsync}
              onEvaluationClick={(selectedEvaluation) =>
                modalState.open(
                  selectedEvaluation.status?.toLowerCase() === 'draft' ? MODES.EDIT : MODES.VIEW,
                  selectedEvaluation,
                )
              }
            />
          )}
        </div>
      </div>

      {permissions.canView && (
        <EvaluationModal
          key={`${modalState.mode}-${modalState.selectedRecord?.id ?? 'new'}-${modalState.isOpen}`}
          open={modalState.isOpen}
          mode={modalState.mode}
          criteriaList={criteriaList}
          evaluation={modalState.selectedRecord}
          permissions={permissions}
          viewerRole={user?.role}
          internOptions={internOptions}
          internMap={internMap}
          onClose={modalState.close}
          onSuccess={notify.success}
          onCreate={createEvaluation.mutateAsync}
          onUpdate={updateEvaluation.mutateAsync}
        />
      )}
    </div>
  )
}
