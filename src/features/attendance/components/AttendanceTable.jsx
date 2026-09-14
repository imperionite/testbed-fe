import { useMemo } from 'react'
import { useMaterialReactTable, MaterialReactTable } from '@glebcha/material-react-table'
import { BadgeAttendanceStatus } from './BadgeAttendanceStatus'

export default function AttendanceTable({ data = [], onValidate }) {
  const columns = useMemo(
    () => [
<<<<<<< HEAD
      { accessorKey: 'attendance_date', header: 'Date' },
      { accessorKey: 'time_in', header: 'Time In' },
      { accessorKey: 'time_out', header: 'Time Out' },
=======
      { accessorKey: "attendance_date", header: "Date" },
      { accessorKey: "time_in", header: "Time In", Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleTimeString() : "-" },
      { accessorKey: "time_out", header: "Time Out", Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleTimeString() : "-" },
      { 
        header: "Lunch", 
        Cell: ({ row }) => {
            if (!row.original.time_in || !row.original.time_out) return "N/A";
            const diff = (new Date(row.original.time_out) - new Date(row.original.time_in)) / (1000 * 60 * 60);
            return diff >= 8 ? "1 Hour" : "N/A";
        }
      },
>>>>>>> 71f7016 ([FR-07] Backend alignment, refactor codes for Student's attendance and implementation of conditions.)
      {
        accessorKey: 'validation_status',
        header: 'Status',
        Cell: ({ cell }) => <BadgeAttendanceStatus value={cell.getValue()} />,
      },
      // Coordinator action column would go here if needed
    ],
    [],
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
