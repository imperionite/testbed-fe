import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useQuery } from '@tanstack/react-query'

import { AuditTable, useAuditLogs } from '../features/audit'
import PageTitleAndSubtitle from '../features/shared/components/PageTitleAndSubtitle'
import { usersApi } from '../api/users'

const AUDIT_ACTIONS = [
  'LOGIN',
  'LOGOUT',
  'PASSWORD_CHANGE',
  'CREATE_USER',
  'UPDATE_USER',
  'CHANGE_ROLE',
  'DEACTIVATE_USER',
  'CREATE_INTERNSHIP',
  'UPDATE_INTERNSHIP',
  'CHANGE_INTERNSHIP_STATUS',
  'ASSIGN_FACULTY_ADVISER',
  'ASSIGN_HTE_SUPERVISOR',
  'CREATE_ATTENDANCE',
  'UPDATE_ATTENDANCE',
  'VALIDATE_ATTENDANCE',
  'REJECT_ATTENDANCE',
  'CREATE_EVALUATION',
  'UPDATE_EVALUATION',
  'SUBMIT_EVALUATION',
  'UPLOAD_DOCUMENT',
  'APPROVE_DOCUMENT',
  'REJECT_DOCUMENT',
  'DELETE_DOCUMENT',
  'GENERATE_REPORT',
]

const DEFAULT_FILTERS = {
  action: '',
  resourceType: '',
  resourceId: '',
  userId: '',
  from: '',
  to: '',
}

function toStartOfDayISOString(date) {
  if (!date) return undefined

  return new Date(`${date}T00:00:00.000Z`).toISOString()
}

function toEndOfDayISOString(date) {
  if (!date) return undefined

  return new Date(`${date}T23:59:59.999Z`).toISOString()
}

function buildApiFilters(filters, page, limit) {
  const apiFilters = {
    page: page + 1,
    limit,
  }

  if (filters.action) {
    apiFilters.action = filters.action
  }

  if (filters.resourceType.trim()) {
    apiFilters.resourceType = filters.resourceType.trim()
  }

  if (filters.resourceId.trim()) {
    apiFilters.resourceId = filters.resourceId.trim()
  }

  if (filters.userId) {
    apiFilters.userId = filters.userId
  }

  if (filters.from) {
    apiFilters.from = toStartOfDayISOString(filters.from)
  }

  if (filters.to) {
    apiFilters.to = toEndOfDayISOString(filters.to)
  }

  return apiFilters
}

export default function AuditLogsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [filterError, setFilterError] = useState('')

  const usersQuery = useQuery({
    queryKey: ['users', 'audit-log-filter'],
    queryFn: usersApi.listUsers,
  })

  const apiFilters = useMemo(
    () => buildApiFilters(appliedFilters, page, rowsPerPage),
    [appliedFilters, page, rowsPerPage],
  )

  const {
    data: logsPage,
    isLoading: isLogsLoading,
    isFetching: isLogsFetching,
    isError: isLogsError,
    error: logsError,
    refetch,
  } = useAuditLogs(apiFilters)

  const logs = logsPage?.items || []
  const total = logsPage?.total || 0

  const users = usersQuery.data || []

  const handleFilterChange = (field) => (event) => {
    setFilters((current) => ({
      ...current,
      [field]: event.target.value,
    }))

    setFilterError('')
  }

  const handleApplyFilters = () => {
    if (filters.from && filters.to && filters.from > filters.to) {
      setFilterError('The From date must not be later than the To date.')
      return
    }

    setFilterError('')
    setPage(0)
    setAppliedFilters({ ...filters })
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setFilterError('')
    setPage(0)
  }

  const handlePageChange = (_event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  const isLoading = isLogsLoading || usersQuery.isLoading
  const isFetching = isLogsFetching && !isLogsLoading

  return (
    <Box>
      <PageTitleAndSubtitle
        title="System Audit Logs"
        subtitle="Review system activity and user actions."
      />

      <Paper
        variant="outlined"
        sx={{
          mt: { xs: 2.5, lg: 3 },
          mb: 2,
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <FilterAltIcon color="action" />

            <Box component="span" sx={{ fontWeight: 600 }}>
              Filter Audit Logs
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Action"
                value={filters.action}
                onChange={handleFilterChange('action')}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 260,
                  },
                }}
              >
                <MenuItem value="">All Actions</MenuItem>

                {AUDIT_ACTIONS.map((action) => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Actor User"
                value={filters.userId}
                onChange={handleFilterChange('userId')}
                disabled={usersQuery.isLoading || usersQuery.isError}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 260,
                  },
                }}
              >
                <MenuItem value="">All Users</MenuItem>

                {users.map((user) => {
                  const fullName = [user.firstName, user.middleName, user.lastName, user.suffix]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <MenuItem key={user.id} value={user.id}>
                      {fullName || user.email}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Resource Type"
                placeholder="e.g. USER, INTERNSHIP, DOCUMENT"
                value={filters.resourceType}
                onChange={handleFilterChange('resourceType')}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 220,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Resource ID"
                placeholder="Enter resource ID"
                value={filters.resourceId}
                onChange={handleFilterChange('resourceId')}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 220,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={filters.from}
                onChange={handleFilterChange('from')}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 200,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={filters.to}
                onChange={handleFilterChange('to')}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  minWidth: {
                    xs: '100%',
                    sm: 200,
                  },
                }}
              />
            </Grid>
          </Grid>

          {filterError && <Alert severity="error">{filterError}</Alert>}

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters}>
              Clear
            </Button>

            <Button variant="contained" startIcon={<FilterAltIcon />} onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {isLogsError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          {logsError?.response?.data?.message ||
            logsError?.message ||
            'Unable to retrieve audit logs.'}
        </Alert>
      )}

      <Box sx={{ width: '100%', position: 'relative' }}>
        {isFetching && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 16,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'background.paper',
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <CircularProgress size={18} />
          </Box>
        )}

        <AuditTable
          data={logs}
          users={users}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  )
}
