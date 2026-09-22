import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { IconButton, Tooltip, Button, Box, Chip, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { BadgeAttendanceStatus } from './BadgeAttendanceStatus'
import dayjs from 'dayjs'

export default function AttendanceTable({ data = [], onValidate, onEdit, onLogAttendance, renderedHours, isStudent = false }) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => dayjs(b.attendance_date).diff(dayjs(a.attendance_date)))
  }, [data])

  const columns = useMemo(
    () => [
      { 
        accessorKey: 'attendance_date', 
        header: 'Date',
        Cell: ({ cell }) => dayjs(cell.getValue()).format('MMM D, YYYY')
      },
      { 
        accessorKey: 'time_in', 
        header: 'Time In', 
        Cell: ({ cell }) => cell.getValue() || '-' 
      },
      { 
        accessorKey: 'time_out', 
        header: 'Time Out', 
        Cell: ({ cell }) => cell.getValue() || '-' 
      },
      {
        accessorKey: 'validation_status',
        header: 'Status',
        Cell: ({ cell }) => <BadgeAttendanceStatus value={cell.getValue()} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => {
          const record = row.original;
          
          if (!isStudent && onValidate && record.validation_status === 'pending') {
            return (
              <Tooltip title="Validate Attendance">
                <IconButton onClick={() => onValidate(record)} size="small" color="primary">
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            );
          }

          if (isStudent && onEdit && record.validation_status === 'pending') {
            return (
              <Tooltip title="Edit Record">
                <Button 
                  size="small" 
                  startIcon={<EditIcon />} 
                  onClick={() => onEdit(record)}
                >
                  Edit
                </Button>
              </Tooltip>
            );
          }

          return null;
        }
      }
    ],
    [onValidate, onEdit, isStudent],
  )

  const table = useMaterialReactTable({
    columns,
    data: sortedData,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', width: '100%', p: 1 }}>
        <Box sx={{ justifySelf: 'start' }}>
          {isStudent && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onLogAttendance}
            >
              Log Attendance
            </Button>
          )}
        </Box>
        
        <Typography variant="h6" fontWeight="bold" sx={{ justifySelf: 'center' }}>
          Attendance Logs
        </Typography>

        <Box sx={{ justifySelf: 'end' }}>
          {isStudent && renderedHours !== undefined && (
            <Chip
              icon={<AccessTimeIcon />}
              label={`Total Validated: ${Number(renderedHours).toFixed(2)} hrs`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.9rem' }}
            />
          )}
        </Box>
      </Box>
    ),
  })

  return <MaterialReactTable table={table} />
}
