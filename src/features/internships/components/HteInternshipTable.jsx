import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { IconButton, Box, Typography, Tooltip } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatUserDate } from '../../shared/fieldFormatters'
import { BadgeStatus } from './BadgeStatus'
import { formatSentenceCase } from '../../shared/fieldFormatters'

const defaultEmptyCellValue = '–'

export default function HteInternshipTable({ data, onView }) {
  const columns = [
    {
      id: 'internship_id',
      accessorKey: 'id',
      header: 'Internship ID',
    },
    {
      id: 'student_id',
      accessorKey: 'student_id',
      header: 'Student ID',
    },
    // {
    //   id: 'hte_id',
    //   accessorKey: 'hte_id',
    //   header: 'HTE ID',
    // },
    {
      id: 'name',
      header: 'Name',
      accessorFn: (row) => {
        const firstName =
          row.studentProfiles?.profiles?.firstName ||
          row.student_profiles?.profiles?.first_name ||
          ''
        const middleName =
          row.studentProfiles?.profiles?.middleName ||
          row.student_profiles?.profiles?.middle_name ||
          ''
        const lastName =
          row.studentProfiles?.profiles?.lastName || row.student_profiles?.profiles?.last_name || ''
        const suffix =
          row.studentProfiles?.profiles?.suffix || row.student_profiles?.profiles?.suffix || ''

        const fullName = [firstName, middleName, lastName, suffix].filter(Boolean).join(' ')

        if (!fullName.trim()) return row.student_id || 'N/A'
        return fullName
      },
      Cell: ({ row, cell }) => {
        const name = cell.getValue()
        const email =
          row.original.student_profiles?.profiles?.email ||
          row.original.studentProfiles?.profiles?.email ||
          defaultEmptyCellValue

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {name}
            <Typography variant="caption">{email}</Typography>
          </Box>
        )
      },
    },
    // {
    //   id: 'email',
    //   accessorKey: 'student_profiles.profiles.email',
    //   header: 'Email',
    // },
    {
      id: 'student_number',
      accessorKey: 'student_profiles.student_number',
      header: 'Student Number',
    },
    {
      id: 'required_hours',
      accessorKey: 'required_hours',
      header: 'Required Hours',
    },
    {
      id: 'internship_status',
      accessorKey: 'status',
      header: 'Internship Status',
      Cell: ({ cell }) => <BadgeStatus value={formatSentenceCase(cell.getValue())} />,
    },
    {
      id: 'contact_number',
      accessorKey: 'student_profiles.contact_number',
      header: 'Contact Number',
      Cell: ({ cell }) => cell.getValue() || defaultEmptyCellValue,
    },
    // {
    //   id: 'address',
    //   accessorKey: 'student_profiles.address',
    //   header: 'Address',
    //   Cell: ({ cell }) => cell.getValue() || defaultEmptyCellValue,
    // },
    {
      id: 'program',
      accessorKey: 'student_profiles.program',
      header: 'Program',
    },
    {
      id: 'section',
      accessorKey: 'student_profiles.section',
      header: 'Section',
    },
    {
      id: 'year_level',
      accessorKey: 'student_profiles.year_level',
      header: 'Year Level',
    },
    // {
    //   id: 'emergency_contact_name',
    //   accessorKey: 'student_profiles.emergency_contact_name',
    //   header: 'Emergency Contact',
    //   Cell: ({ row, cell }) => {
    //     const contactName = cell.getValue()
    //     const contactPhone =
    //       row.original.student_profiles.emergency_contact_number || defaultEmptyCellValue

    //     return (
    //       <div>
    //         {contactName}
    //         {contactPhone && <div style={{ fontSize: '0.8rem' }}>{contactPhone}</div>}
    //       </div>
    //     )
    //   },
    // },
    // {
    //   id: 'emergency_contact_number',
    //   accessorKey: 'student_profiles.emergency_contact_number',
    //   header: 'Emergency Phone',
    //   Cell: ({ cell }) => cell.getValue() || defaultEmptyCellValue,
    // },
    {
      id: 'created_at',
      header: 'Created at',
      accessorFn: (row) => formatUserDate(row.student_profiles.created_at) || defaultEmptyCellValue,
    },
    {
      id: 'updated_at',
      header: 'Updated',
      accessorFn: (row) => formatUserDate(row.student_profiles.updated_at) || defaultEmptyCellValue,
    },

    {
      id: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Tooltip title="View Details">
          <IconButton
            aria-label="View Details"
            onClick={() => onView(row.original)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
      size: 150,
    },
  ]

  const table = useMaterialReactTable({
    columns: columns,
    data: data || [],
    initialState: {
      pagination: { pageSize: 25, pageIndex: 0 },
      columnPinning: { right: ['actions'] },
      columnVisibility: {
        internship_id: false,
        student_id: false,
        updated_at: false,
      },
    },
    enableStickyHeader: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    muiTableContainerProps: { sx: { maxHeight: '500px' } },
    enableExpanding: true,
    renderDetailPanel: ({ row }) => (
      <Box sx={{ ml: 7 }}>
        <Typography variant="body2">
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            Address:
          </Box>{' '}
          {row.original.student_profiles?.address}
        </Typography>

        <Typography variant="body2">
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            Emergency Contact:
          </Box>{' '}
          {row.original.student_profiles?.emergency_contact_name} | {' '}          
          {row.original.student_profiles?.emergency_contact_number}
        </Typography>
      </Box>
    ),
  })

  return <MaterialReactTable table={table} />
}
