import { useMemo } from 'react'
import { useMaterialReactTable, MaterialReactTable } from '@glebcha/material-react-table'
import { BadgeAttendanceStatus } from './BadgeAttendanceStatus'

export default function AttendanceTable({ data = [] }) {
  const columns = useMemo(
    () => [
      { accessorKey: 'attendance_date', header: 'Date' },
      { accessorKey: 'time_in', header: 'Time In' },
      { accessorKey: 'time_out', header: 'Time Out' },
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
