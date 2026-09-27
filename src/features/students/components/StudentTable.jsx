import { useMemo } from 'react'
import { MaterialReactTable } from '@glebcha/material-react-table'
import { IconButton, Typography, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { formatSentenceCase } from '../../shared/fieldFormatters'
import { BadgeStatus } from '../../internships/components/BadgeStatus'
import { formatUserDate } from '../../shared/fieldFormatters'
import VisibilityIcon from '@mui/icons-material/Visibility'

export default function StudentTable({ data, onEdit, onView, role }) {
  const columns = useMemo(() => {
    const allColumns = [
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row) => {
          const firstName = row.firstName || row.first_name || ''
          const middleName = row.middleName || row.middle_name || ''
          const lastName = row.lastName || row.last_name || ''

          const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

          if (!fullName.trim()) return row.student_number || 'N/A'
          return fullName
        },
        size: 200,
      },
      {
        id: 'student_number',
        header: 'Student Number',
        accessorFn: (row) => row?.student_number || 'N/A',
      },
      {
        id: 'email',
        header: 'Email',
        accessorFn: (row) => row?.profiles?.email || row?.email || 'N/A',
      },
      { id: 'program', header: 'Program', accessorFn: (row) => row?.program || 'N/A' },
      { id: 'year_level', header: 'Year', accessorFn: (row) => row?.year_level || 'N/A' },
      { id: 'section', header: 'Section', accessorFn: (row) => row?.section || 'N/A' },
      {
        id: 'contact_number',
        header: 'Contact Number',
        accessorFn: (row) => row?.contact_number || 'N/A',
      },
      { id: 'address', header: 'Address', accessorFn: (row) => row?.address || 'N/A' },

      // { id: 'emergency_contact_name', header: 'Emergency Contact', accessorFn: (row) => row?.emergency_contact_name || 'N/A' },
      // { id: 'emergency_contact_number', header: 'Emergency Phone', accessorFn: (row) => row?.emergency_contact_number || 'N/A' },

      {
        id: 'emergency_contact',
        header: 'Emergency Contact',
        accessorFn: (row) => {
          row?.emergency_contact_name || 'N/A'
        },
        Cell: ({ row }) => {
          const emergencyContactName = row.original?.emergency_contact_name
          const emergencyContactNumber = row.original?.emergency_contact_number
          if (!emergencyContactName && !emergencyContactNumber) {
            return (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )
          }
          return (
            <Box>
              <Typography variant="body2">{emergencyContactName || 'N/A'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {emergencyContactNumber || 'N/A'}
              </Typography>
            </Box>
          )
        },
      },
      {
        id: 'hte_company',
        header: 'HTE Name',
        accessorFn: (row) => {
          const internship = row?.currentInternship || row?.current_internship
          return internship?.hte_profiles?.company_name || 'N/A'
        },
      },
      {
        id: 'hte_contact',
        header: 'HTE Contact',
        accessorFn: (row) => {
          const internship = row?.currentInternship || row?.current_internship
          return internship?.hte_profiles?.contact_person || 'N/A'
        },
        Cell: ({ row }) => {
          const internship = row.original?.currentInternship || row.original?.current_internship
          const hte = internship?.hte_profiles
          if (!hte || (!hte.contact_person && !hte.contact_email)) {
            return (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )
          }
          return (
            <Box>
              <Typography variant="body2">{hte.contact_person || 'N/A'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {hte.contact_email || 'N/A'}
              </Typography>
            </Box>
          )
        },
      },
      {
        id: 'internship_status',
        header: 'Internship Status',
        accessorFn: (row) => {
          const internship = row?.currentInternship || row?.current_internship
          return internship?.status || 'N/A'
        },
        Cell: ({ cell }) => <BadgeStatus value={formatSentenceCase(cell.getValue())} />,
      },
      {
        id: 'required_hours',
        header: 'Required Hours',
        accessorFn: (row) => {
          const internship = row?.currentInternship || row?.current_internship
          return internship?.required_hours || 'N/A'
        },
      },

      {
        accessorKey: 'created_at',
        header: 'Created At',
        Cell: ({ cell }) => formatUserDate(cell.getValue()),
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        Cell: ({ cell }) => formatUserDate(cell.getValue()),
      },

      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) =>
          role === 'faculty_adviser' ? (
            <IconButton
              color="primary"
              onClick={() => onView?.(row.original)}
              title="View Student Details"
            >
              <VisibilityIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={() => onEdit?.(row.original)} title="Edit Student">
              <EditIcon />
            </IconButton>
          ),
      },
    ]

    const isStaff = [
      'administrator',
      'internship_coordinator',
      'hte_supervisor',
      'faculty_adviser',
    ].includes(role)

    if (!isStaff) {
      return allColumns.filter((col) =>
        ['student_number', 'contact_number', 'address', 'emergency_contact', 'actions'].includes(
          col.accessorKey || col.id,
        ),
      )
    }

    if (isStaff) {
      return allColumns.filter((col) =>
        [
          'name',
          'student_number',
          'email',
          'internship_status',
          'program',
          'year_level',
          'section',
          'contact_number',
          'address',
          'emergency_contact',
          'created_at',
          'updated_at',
          'actions',
        ].includes(col.accessorKey || col.id),
      )
    }
    return allColumns
  }, [onEdit, onView, role])

  return (
    <MaterialReactTable
      columns={columns}
      data={data || []}
      initialState={{
        pagination: { pageSize: 25, pageIndex: 0 },
        columnPinning: { right: ['actions'] },
      }}
      enableStickyHeader
      enableColumnPinning
      muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
    />
  )
}
