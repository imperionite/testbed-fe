import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { formatSentenceCase } from '../../shared/fieldFormatters'
import { defaultTableConfig } from '../../shared/config/defaultTableConfig'

export default function ReportTable({ data = [] }) {
  const columns = useMemo(
    () => [
      { accessorKey: 'student.name', header: 'Student Name' },
      { accessorKey: 'student.studentNumber', header: 'Student Number' },
      { accessorKey: 'student.program', header: 'Program' },
      { accessorKey: 'hte.companyName', header: 'Company' },
      { 
        accessorKey: 'status', 
        header: 'Status', 
        Cell: ({ cell }) => formatSentenceCase(cell.getValue())
      },
      { accessorKey: 'renderedHours', header: 'Rendered Hours' },
      { accessorKey: 'remainingHours', header: 'Remaining Hours' },
    ],
    [],
  )

  const table = useMaterialReactTable({
    ...defaultTableConfig,
    columns,
    data,
    initialState: {
      ...defaultTableConfig.initialState
    }
  })

  return <MaterialReactTable table={table} />
}
