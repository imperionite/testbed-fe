import { useMemo } from 'react'
import { Box, TablePagination } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'

import { formatDate } from '../../htes/form/fieldFormatters'
import { defaultTableConfig } from '../../shared/config/defaultTableConfig'

function getUserName(user) {
  if (!user) return null

  const fullName = [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(' ')

  return fullName || user.email || null
}

export default function AuditTable({
  data = [],
  users = [],
  isLoading = false,
  page = 0,
  rowsPerPage = 20,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
}) {
  const userMap = useMemo(() => {
    return users.reduce((map, user) => {
      map[user.id] = getUserName(user)
      return map
    }, {})
  }, [users])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Timestamp',
        Cell: ({ cell }) => formatDate(cell.getValue()) || '—',
      },
      {
        accessorKey: 'action',
        header: 'Action',
      },
      {
        accessorKey: 'resource_type',
        header: 'Resource Type',
      },
      {
        accessorKey: 'resource_id',
        header: 'Resource ID',
        Cell: ({ cell }) => cell.getValue() || '—',
      },
      {
        accessorKey: 'user_id',
        header: 'User',
        Cell: ({ cell }) => {
          const userId = cell.getValue()

          return userMap[userId] || userId || 'System'
        },
      },
      {
        accessorKey: 'ip_address',
        header: 'IP Address',
        Cell: ({ cell }) => cell.getValue() || '—',
      },
    ],
    [userMap],
  )

  const table = useMaterialReactTable({
    ...defaultTableConfig,

    columns,
    data,

    enablePagination: false,
    enableColumnFilters: false,

    state: {
      isLoading,
    },

    muiCircularProgressProps: {
      color: 'secondary',
    },

    initialState: {
      ...defaultTableConfig.initialState,
      sorting: [{ id: 'created_at', desc: true }],
    },
  })

  return (
    <Box sx={{ width: '100%' }}>
      <MaterialReactTable table={table} />

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Rows per page:"
      />
    </Box>
  )
}
