import React, { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'

export default function ReportTable({ data = [] }) {
  const columns = useMemo(
    () => [
      { accessorKey: 'student.name', header: 'Student Name' },
      { accessorKey: 'student.studentNumber', header: 'Student Number' },
      { accessorKey: 'student.program', header: 'Program' },
      { accessorKey: 'hte.companyName', header: 'Company' },
      { accessorKey: 'status', header: 'Status' },
      { accessorKey: 'renderedHours', header: 'Rendered Hours' },
      { accessorKey: 'remainingHours', header: 'Remaining Hours' },
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
