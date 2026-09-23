import { useMemo, useState, useEffect } from 'react'
import { MaterialReactTable, useMaterialReactTable } from '@glebcha/material-react-table'
import { usersApi } from '../../../api/users'
// import { CircularProgress } from '@mui/material'

export default function AuditTable({ data = [] }) {
  const [userMap, setUserMap] = useState({})
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersApi.listUsers()
        const map = users.reduce((acc, user) => {
          acc[user.id] = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
          return acc
        }, {})
        setUserMap(map)
      } catch (error) {
        console.error("Failed to fetch users for audit mapping", error)
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
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
      },
      { accessorKey: 'action', header: 'Action' },
      { accessorKey: 'resource_type', header: 'Resource Type' },
      { accessorKey: 'resource_id', header: 'Resource ID' },
      { 
        accessorKey: 'user_id', 
        header: 'User',
        Cell: ({ cell }) => userMap[cell.getValue()] || cell.getValue() || 'System'
      },
      { accessorKey: 'ip_address', header: 'IP Address' },
    ],
    [userMap],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    state: { isLoading: isLoadingUsers },
    muiCircularProgressProps: { color: 'secondary' },
  })

  return <MaterialReactTable table={table} />
}
