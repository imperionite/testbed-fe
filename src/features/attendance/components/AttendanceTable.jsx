import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { IconButton, Tooltip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { BadgeAttendanceStatus } from './BadgeAttendanceStatus'

export default function AttendanceTable({ data = [], onValidate }) {
  const columns = useMemo(
    () => [
      { accessorKey: 'attendance_date', header: 'Date' },
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
        header: "Lunch", 
        Cell: ({ row }) => {
            const timeIn = row.original.time_in;
            const timeOut = row.original.time_out;
            if (!timeIn || !timeOut || timeOut === '00:00:00') return "N/A";
            
            const parseTime = (timeStr) => {
                const [h, m] = timeStr.split(':').map(Number);
                return h * 60 + m;
            };
            
            const diffHours = (parseTime(timeOut) - parseTime(timeIn)) / 60;
            return diffHours >= 8 ? "1 Hour" : "N/A";
        }
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
            if (row.original.validation_status !== 'pending') return null;
            return (
                <Tooltip title="Validate Attendance">
                    <IconButton onClick={() => onValidate(row.original)} size="small" color="primary">
                        <CheckCircleIcon />
                    </IconButton>
                </Tooltip>
            )
        }
      }
    ],
    [onValidate],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
  })

  return <MaterialReactTable table={table} />
}
