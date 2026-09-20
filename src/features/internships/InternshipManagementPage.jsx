import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  EditNote as EditNoteIcon,
  History as HistoryIcon,
} from '@mui/icons-material'
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

function ProgressCell({ internshipId, requiredHours }) {
  const { data, isLoading } = useQuery({
    queryKey: ['renderedHours', internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId,
  })

  if (isLoading) return 'Loading...'
  const hours = data?.totalHours || 0
  return `${Number(hours).toFixed(2)} / ${requiredHours || 0} hours`
}

export default function InternshipManagementPage() {
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
    queryClient.invalidateQueries({ queryKey: ['renderedHours', attendanceModalState.internship?.id] })
    setAttendanceModalState({ open: false, internship: null })
  }

  const columns = useMemo(
    () => [
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
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <BadgeStatus value={cell.getValue()} />,
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
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Attendance">
              <IconButton size="small" onClick={() => handleOpenAttendance(row.original)}>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [studentMap, adviserMap],
  )

  const table = useMaterialReactTable({
    columns,
    data: internships,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableHiding: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionActionsColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-actions': { size: 100 },
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
<<<<<<< HEAD
          startDate: data.updateStartDate
        }
=======
          startDate: data.updateStartDate,
        },
>>>>>>> f1159aa6db675e8fc4b5e7051019b066bc26cb6e
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
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Internship Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal(MODES.CREATE)}
        >
          Add New Intern
        </Button>
      </Box>

      {/* Summary Metrics */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <CardStat
          title="Deployed Interns"
          value={internships.filter((i) => i.status === 'active').length}
        />
        <CardStat
          title="Pending Interns"
          value={internships.filter((i) => i.status === 'pending').length}
        />
        <CardStat
          title="Completed Internships"
          value={internships.filter((i) => i.status === 'completed').length}
        />
        <CardStat title="HTE Partners" value={new Set(internships.map((i) => i.hte_id)).size} />
      </Stack>

      {/* Toolbar & Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Interns List</Typography>
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
