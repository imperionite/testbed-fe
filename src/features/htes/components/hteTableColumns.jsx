import { MenuItem, Box, Typography } from '@mui/material'
import BadgeStatus from './BadgeStatus'
import { defaultEmptyCellValue, formatDate } from '../../shared/fieldFormatters'

export function createHteTableColumns({ canEdit, supervisorMap = {} }) {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 100,
      enableColumnFilter: true,
      enableEditing: false,
      muiTableBodyCellProps: {
        sx: {
          overflow: 'default',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
    },
    {
      accessorKey: 'company_name',
      header: 'Company Name',
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
    },
    {
      accessorKey: 'supervisor_id',
      header: 'Supervisor',
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
      Cell: ({ cell }) => {
        const id = cell.getValue()
        if (!id) return defaultEmptyCellValue
        return supervisorMap[id] ?? id
      },
    },
    {
      accessorKey: 'contact_person',
      header: 'Contact Person',
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
      Cell: ({ row, cell }) => {
        const name = cell.getValue()
        const email = row.original.contact_email || ''

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {name}
            <Typography variant="caption">{email}</Typography>
          </Box>
        )
      },
    },
    // {
    //   accessorKey: 'contact_email',
    //   header: 'Contact Email',
    //   size: 220,
    //   enableColumnFilter: true,
    //   enableEditing: false,
    // },
    {
      accessorKey: 'contact_number',
      header: 'Contact Number',
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
      Cell: ({ cell }) => cell.getValue() || defaultEmptyCellValue,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      size: 200,
      enableColumnFilter: true,
      enableEditing: false,
      Cell: ({ cell }) => cell.getValue() || defaultEmptyCellValue,
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
      Cell: ({ cell }) => <BadgeStatus value={cell.getValue() ? 'Active' : 'Inactive'} />,
      enableEditing: canEdit,
      muiEditTextFieldProps: {
        select: true,
        children: [
          <MenuItem key="active" value={true}>
            Active
          </MenuItem>,
          <MenuItem key="inactive" value={false}>
            Inactive
          </MenuItem>,
        ],
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      size: 160,
      enableColumnFilter: false,
      enableEditing: false,
      Cell: ({ cell }) => formatDate(cell.getValue()),
    },
    // {
    //   accessorKey: 'updated_at',
    //   header: 'Updated',
    //   size: 160,
    //   enableColumnFilter: false,
    //   enableEditing: false,
    //   Cell: ({ cell }) => formatDate(cell.getValue()),
    // },
  ]
}
