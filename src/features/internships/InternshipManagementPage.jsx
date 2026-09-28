import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material'
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  // Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  EditNote as EditNoteIcon,
} from '@mui/icons-material'
import DateRangeIcon from '@mui/icons-material/DateRange';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { useMaterialReactTable } from '@glebcha/material-react-table'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '../../api/attendance'
import CardStat from '../shared/components/CardStat'
import InternshipTable from './components/InternshipTable'
import InternshipModal from './components/InternshipModal'
import { BadgeStatus } from './components/BadgeStatus'
import AttendanceViewModal from '../attendance/components/AttendanceViewModal'
import { useInternshipMutations } from './hooks/useInternshipMutations'
import { useInternshipsData } from './hooks/useInternshipsData'
import { MODES } from './form/formConfig'
import { useUiPermissions } from '../shared/hooks/useUiPermissions'
import PageTitleAndSubtitle from '../shared/components/PageTitleAndSubtitle'
import { formatSentenceCase } from '../shared/fieldFormatters'
import { defaultTableConfig } from '../shared/config/defaultTableConfig'
// import { DateRangeIcon } from '@mui/x-date-pickers'

function ProgressCell({ internshipId, requiredHours }) {
  const { isStudent, isCoordinator } = useUiPermissions()

  /**
   * Per backend requirements in attendance.routes.ts:
   * /internship/:internshipId/rendered-hours requires 'student' or 'internship_coordinator'
   */

  const canViewAttendance = isStudent || isCoordinator

  const { data, isLoading } = useQuery({
    queryKey: ['renderedHours', internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId && canViewAttendance,
  })

  if (!canViewAttendance) return 'N/A'
  if (isLoading) return 'Loading...'

  const hours = data?.totalHours || 0
  return `${Number(hours).toFixed(2)} / ${requiredHours || 0} hours`
}

export default function InternshipManagementPage() {
  const { isCoordinator, isReadOnlyStaff } = useUiPermissions()
  const canEditAttendance = isCoordinator

  const [modalState, setModalState] = useState({
    open: false,
    mode: MODES.CREATE,
    internship: null,
  })
  const [attendanceModalState, setAttendanceModalState] = useState({
    open: false,
    internship: null,
  })

  const queryClient = useQueryClient()
  const { internships, studentMap, adviserMap, isLoading, isError, refetch } = useInternshipsData()
  const { createInternship, updateStatus, assignAdviser, updateInternship } =
    useInternshipMutations()

  const handleOpenModal = (mode, internship = null) => {
    setModalState({ open: true, mode, internship })
  }

  const handleCloseModal = () => {
    setModalState({ open: false, mode: MODES.CREATE, internship: null })
  }

  const handleCreate = async (data) => {
    await createInternship.mutateAsync(data)
    handleCloseModal()
  }

  const handleOpenAttendance = (internship) => {
    setAttendanceModalState({ open: true, internship })
  }

  const handleCloseAttendance = () => {
    // Invalidate renderedHours query when closing attendance modal
    queryClient.invalidateQueries({
      queryKey: ['renderedHours', attendanceModalState.internship?.id],
    })
    setAttendanceModalState({ open: false, internship: null })
  }

  const columns = useMemo(() => {
    const allColumns = [
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row) => {
          const student = studentMap[row.student_id] || {}
          const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ')
          return fullName.trim() || row.student_profiles?.student_number || 'N/A'
        },
        Cell: ({ row }) => {
          const student = studentMap[row.original.student_id] || {}
          const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ')
          return (
            <Box>
              <Typography variant="body2">
                {fullName.trim() ||
                  'Student #' + (row.original.student_profiles?.student_number || 'N/A')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Program: {row.original.student_profiles?.program || 'N/A'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'hte_profiles.company_name',
        header: 'HTE Partner',
      },
      {
        id: 'facultyAdviser',
        header: 'Faculty Adviser',
        accessorFn: (row) => {
          const adviser = row.faculty_advisers || adviserMap[row.faculty_adviser_id]
          return adviser ? `${adviser.first_name} ${adviser.last_name}` : 'Not Assigned'
        },
      },
      {
        id: 'program',
        accessorKey: 'student_profiles.program',
        header: 'Program',
      },
      {
        accessorKey: 'progress',
        header: 'Progress',
        Cell: ({ row }) => (
          <ProgressCell
            internshipId={row.original.id}
            requiredHours={row.original.required_hours}
          />
        ),
      },
      {
        id: 'required_hours',
        accessorKey: 'required_hours',
        header: 'Required Hours',
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <BadgeStatus value={formatSentenceCase(cell.getValue())} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Update Status">
              <IconButton
                size="small"
                onClick={() => handleOpenModal(MODES.EDIT_STATUS, row.original)}
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Assign Adviser">
              <IconButton
                size="small"
                onClick={() => handleOpenModal(MODES.EDIT_ADVISER, row.original)}
              >
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Details">
              <IconButton
                size="small"
                onClick={() => handleOpenModal(MODES.EDIT_DETAILS, row.original)}
              >
                <DomainAddIcon />
              </IconButton>
            </Tooltip>

            {!!canEditAttendance && (
              <Tooltip title="View Attendance">
                <IconButton size="small" onClick={() => handleOpenAttendance(row.original)}>
                  <DateRangeIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
      },
    ]
    return allColumns.filter((col) => {
      const colId = col.accessorKey || col.id
      if (canEditAttendance) {
        // Coordinator mode: Show 'progress', hide 'required\_hours'
        return colId !== 'required_hours'
      } else {
        // Admin/Other modes: Show 'required_hours', hide 'progress'
        return colId !== 'progress'
      }
    })
  }, [studentMap, adviserMap, canEditAttendance])

  const table = useMaterialReactTable({
    ...defaultTableConfig,
    columns,
    data: internships,
    enableColumnActions: false,
    positionActionsColumn: 'last',
    initialState: {
      ...defaultTableConfig.initialState,
      columnPinning: {
      right: ['actions'],
    },
    },
    displayColumnDefOptions: {
      'actions': { size: 100 },
    },
    muiPaginationProps: {
      showFirstButton: false,
      showLastButton: false,
    },
  })

  const handleUpdateStatus = async (data) => {
    // If startDate needs to be updated (Early Activation)
    if (data.updateStartDate) {
      await updateInternship.mutateAsync({
        id: modalState.internship.id,
        payload: {
          startDate: data.updateStartDate,
        },
      })
    }
    // Update status
    await updateStatus.mutateAsync({ id: modalState.internship.id, status: data.status })
    handleCloseModal()
  }

  const handleAssignAdviser = async (data) => {
    await assignAdviser.mutateAsync({
      id: modalState.internship.id,
      facultyAdviserId: data.facultyAdviserId || null,
    })
    handleCloseModal()
  }

  const handleUpdateDetails = async (data) => {
    await updateInternship.mutateAsync({ id: modalState.internship.id, payload: data })
    handleCloseModal()
  }

  return (
    <Box>
      {/* Header Section */}
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
                  title="Internship Overview"
                  subtitle={
                    isReadOnlyStaff
                      ? 'Manage the internship lifecycle.'
                      : ' '
                  }
                />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal(MODES.CREATE)}
        >
          Add New Intern
        </Button>
      </Box>

      {/* Summary Metrics */}

      <Grid container spacing={1}>
        <Grid
          size={{
            xs: 6,
            md: 3,
            lg: 2.4,
          }}
        >
          <CardStat
            sx={{ height: '100%' }}
            title="Deployed Interns"
            value={internships.filter((i) => i.status === 'active').length}
          />
        </Grid>

        <Grid
          size={{
            xs: 6,
            md: 3,
            lg: 2.4,
          }}
        >
          <CardStat
            sx={{ height: '100%' }}
            title="Pending Interns"
            value={internships.filter((i) => i.status === 'pending').length}
          />
        </Grid>

        <Grid
          size={{
            xs: 6,
            md: 3,
            lg: 2.4,
          }}
        >
          <CardStat
            sx={{ height: '100%' }}
            title="Completed Internships"
            value={internships.filter((i) => i.status === 'completed').length}
          />
        </Grid>

        <Grid
          size={{
            xs: 6,
            md: 3,
            lg: 2.4,
          }}
        >
          <CardStat
            sx={{ height: '100%' }}
            title="HTE Partners"
            value={new Set(internships.map((i) => i.hte_id)).size}
          />
        </Grid>
      </Grid>

      {/* Toolbar & Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: { xs: 4, lg: 5 },
          mb: 1,
        }}
      >
        <PageTitleAndSubtitle title="Interns List" />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => table.setShowColumnFilters(!table.getState().showColumnFilters)}
        >
          Filters
        </Button>
      </Box>

      {/* Data Table */}
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Alert
          action={
            <Button onClick={refetch} color="inherit" size="small">
              Retry
            </Button>
          }
          severity="error"
        >
          Error loading data
        </Alert>
      ) : (
        <InternshipTable table={table} />
      )}

      <InternshipModal
        open={modalState.open}
        mode={modalState.mode}
        internship={modalState.internship}
        internships={internships}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        onAssignAdviser={handleAssignAdviser}
        onUpdateDetails={handleUpdateDetails}
        onCreate={handleCreate}
      />
      <AttendanceViewModal
        open={attendanceModalState.open}
        onClose={handleCloseAttendance}
        internshipId={attendanceModalState.internship?.id}
      />
    </Box>
  )
}
