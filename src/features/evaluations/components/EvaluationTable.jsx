import { useMemo } from 'react'
import { Chip, Stack, Typography } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'

import { EVALUATION_CRITERIA } from '../form/evaluationConfig'

const formatPerson = (person) => person?.full_name || 'Not assigned'

const formatEvaluationType = (type) => {
  switch (type) {
    case 'hte_supervisor':
      return 'HTE Supervisor'
    case 'faculty_adviser':
      return 'Faculty Adviser'
    default:
      return type || '—'
  }
}

export default function EvaluationTable({ evaluations = [], onRowClick, readOnly = false }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'student.full_name',
        header: 'Student Intern',
        Cell: ({ row }) => row.original.student?.full_name || 'Unknown student',
      },

      {
        accessorKey: 'student.email',
        header: 'Student Email',
        Cell: ({ row }) => row.original.student?.email || '—',
      },

      {
        accessorKey: 'student.program',
        header: 'Program',
        Cell: ({ row }) => row.original.student?.program || '—',
      },

      {
        accessorKey: 'student.student_number',
        header: 'Student Number',
        Cell: ({ row }) => row.original.student?.student_number || '—',
      },

      {
        accessorKey: 'student.section',
        header: 'Year / Section',
        Cell: ({ row }) => {
          const student = row.original.student

          if (!student) {
            return '—'
          }

          return `${student.year_level ?? '—'} / ${student.section ?? '—'}`
        },
      },

      {
        accessorKey: 'internship_id',
        header: 'Internship ID',
      },

      {
        accessorKey: 'evaluation_type',
        header: 'Evaluation Type',
        Cell: ({ cell }) => formatEvaluationType(cell.getValue()),
      },

      {
        id: 'evaluator',
        header: 'Evaluator',
        Cell: ({ row }) => {
          const evaluation = row.original

          const evaluator = evaluation.evaluator

          return (
            <Stack spacing={0.25}>
              <Typography variant="body2">{formatPerson(evaluator)}</Typography>

              <Typography variant="caption" color="text.secondary">
                {formatEvaluationType(evaluation.evaluation_type)}
              </Typography>

              {evaluator?.email && (
                <Typography variant="caption" color="text.secondary">
                  {evaluator.email}
                </Typography>
              )}
            </Stack>
          )
        },
      },

      {
        id: 'responses',
        header: 'Responses',
        Cell: ({ row }) => {
          const responses = row.original.responses ?? {}

          return (
            <Stack spacing={0.5}>
              {EVALUATION_CRITERIA.map(({ key, label }) => (
                <Typography key={key} variant="body2">
                  <strong>{label}:</strong> {responses[key] ?? '—'}
                </Typography>
              ))}
            </Stack>
          )
        },
      },

      {
        accessorKey: 'comments',
        header: 'Comments',
        Cell: ({ cell }) => cell.getValue() || '—',
      },

      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <Chip size="small" label={cell.getValue()} />,
      },

      {
        accessorKey: 'submitted_at',
        header: 'Submitted',
        Cell: ({ cell }) => {
          const value = cell.getValue()

          return value ? new Date(value).toLocaleString() : '—'
        },
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: evaluations,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableRowActions: !readOnly,

    positionActionsColumn: 'last',

    renderRowActions: readOnly
      ? undefined
      : ({ row }) => (
          <button
            type="button"
            onClick={() => onRowClick?.(row.original)}
            style={{
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Edit / View
          </button>
        ),

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting: [
        {
          id: 'submitted_at',
          desc: true,
        },
      ],
    },
  })

  return <MaterialReactTable table={table} />
}
