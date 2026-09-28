import { useMemo } from 'react'
import { Stack, Typography, Tooltip, IconButton } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import EditIcon from '@mui/icons-material/Edit'
import { BadgeEvaluations } from '../../shared/components/BadgeEvaluations'
import { EVALUATION_CRITERIA } from '../form/evaluationConfig'
import { formatDate } from '../../htes/form/fieldFormatters'
import { defaultTableConfig } from '../../shared/config/defaultTableConfig'

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
        Cell: ({ cell }) => <BadgeEvaluations status={cell.getValue()} />,
      },

      {
        accessorKey: 'submitted_at',
        header: 'Submitted',
        Cell: ({ cell }) => formatDate(cell.getValue()) || '—',
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    ...defaultTableConfig,
    columns,
    data: evaluations,
    enableRowActions: !readOnly,

    positionActionsColumn: 'last',

    renderRowActions: readOnly
      ? undefined
      : ({ row }) => (
          <Tooltip title="Edit / View">
            <IconButton
              aria-label="Edit / View"
              size="small"
              onClick={() => onRowClick?.(row.original)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),

    initialState: {
      ...defaultTableConfig.initialState,
      columnPinning: { right: ['mrt-row-actions'] },
      sorting: [
        {
          id: 'submitted_at',
          desc: false,
        },
      ],
    },
  })

  return <MaterialReactTable table={table} />
}
