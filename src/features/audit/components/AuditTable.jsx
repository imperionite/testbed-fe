import { useMemo, useState, useEffect } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { usersApi } from '../../../api/users'
import { formatDate } from '../../htes/form/fieldFormatters'
import { defaultTableConfig } from '../../shared/config/defaultTableConfig'
// import { CircularProgress } from '@mui/material'

export default function AuditTable({ data = [] }) {
  const [userMap, setUserMap] = useState({})
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersApi.listUsers()
        const map = users.reduce((acc, user) => {
          acc[user.id] =
            `${user.firstName || user.first_name} ${user.middleName || user.middle_name || ''} ${user.lastName || user.last_name} ${user.suffix || ''}`.trim() ||
            user.email
          return acc
        }, {})
        setUserMap(map)
      } catch (error) {
        console.error('Failed to fetch users for audit mapping', error)
      } finally {
        setIsLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Timestamp',
        Cell: ({ cell }) => formatDate(cell.getValue()) || '—',
      },
      { accessorKey: 'action', header: 'Action' },
      { accessorKey: 'resource_type', header: 'Resource Type' },
      { accessorKey: 'resource_id', header: 'Resource ID' },
      {
        accessorKey: 'user_id',
        header: 'User',
        Cell: ({ cell }) => userMap[cell.getValue()] || cell.getValue() || 'System',
      },
      { accessorKey: 'ip_address', header: 'IP Address' },
    ],
    [userMap],
  )

  const table = useMaterialReactTable({
    ...defaultTableConfig,
    columns,
    data,
    state: { isLoading: isLoadingUsers },
    muiCircularProgressProps: { color: 'secondary' },
    initialState: {
      ...defaultTableConfig.initialState,
      sorting: [{ id: 'created_at', desc: true }],
    },
  })

  return <MaterialReactTable table={table} />
}
