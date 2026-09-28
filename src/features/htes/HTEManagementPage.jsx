import { Alert, Button, CircularProgress, Box, Grid } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import CardStat from '../shared/components/CardStat'
import HteTable from './components/HteTable'
import HteModal from './components/HteModal'
import { useHteModalState } from './hooks/useHteModalState'
import useAuth from '../../hooks/useAuth'
import { useHtes } from './hooks/useHtes'
import { useHteMutations } from './hooks/useHteMutations'
import { getHteManagementPermissions } from './htePermissions'
import { useSupervisorUsers } from '../users/hooks/useUsers'
import notify from '../../utils/toast'
import PageTitleAndSubtitle from '../shared/components/PageTitleAndSubtitle'

// ============================================
// MAIN COMPONENT
// ============================================
export default function HteManagementLayout() {
  const { user } = useAuth()
  const permissions = getHteManagementPermissions(user?.role)

  const {
    data: hteData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHtes({
    enabled: permissions.canView,
  })

  // Supervisor Mapping Block
  const { data: supervisorUsers = [] } = useSupervisorUsers({
    enabled: permissions.canView,
  })

  const supervisorOptions = supervisorUsers.filter((u) => u.isActive === true)

  const supervisorMap = Object.fromEntries(
    supervisorUsers.map((u) => [
      u.id,
      [u.firstName, u.middleName, u.lastName, u.suffix].filter(Boolean).join(' '),
    ]),
  )

  const modalState = useHteModalState()
  const { createHte, updateHte, updateHteSupervisor, updateStatus, bulkUpdateStatus } =
    useHteMutations()

  return (
    <Box>
      {/* ==================== TOP SECTION ==================== */}
      <Box>
        {/* Header: Title + Action Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
            width: '100%',
          }}
        >
          <PageTitleAndSubtitle
            title="Host Training Establishment (HTE) Management Page"
            subtitle="Manage HTE data and supervisor assignments."
          />
          {permissions.canCreate && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => modalState.open('create')}
              sx={{ flexShrink: 0 }}
            >
              Register HTE
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={1}>
          <Grid size={{ xs: 6, md: 4, lg: 2.5 }}>
            <CardStat title="Total HTE Partners" value={hteData.length} />
          </Grid>

          <Grid size={{ xs: 6, md: 4, lg: 2.5 }}>
            <CardStat
              title="Active HTE Partners"
              value={hteData.filter((u) => u.is_active === true).length}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ==================== MAIN SECTION ==================== */}
      <Box sx={{ width: '100%', mt: { xs: 2.5, lg: 3 } }}>
        {!permissions.canView ? (
          <Alert severity="error">You do not have permission to view HTEs.</Alert>
        ) : isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={28} />
          </Box>
        ) : isError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            {error?.response?.data?.message || 'Unable to load HTEs. Please try again.'}
          </Alert>
        ) : hteData.length === 0 ? (
          <Alert
            severity="info"
            action={
              permissions.canCreate ? (
                <Button color="inherit" size="small" onClick={() => modalState.open('create')}>
                  Register HTE
                </Button>
              ) : undefined
            }
          >
            No HTEs found.
          </Alert>
        ) : (
          <HteTable
            htes={hteData}
            permissions={permissions}
            supervisorMap={supervisorMap}
            onBulkStatusChange={bulkUpdateStatus.mutateAsync}
            onHteClick={(selectedHte) => modalState.open('edit', selectedHte)}
          />
        )}
      </Box>

      <HteModal
        key={`${modalState.mode}-${modalState.selectedHte?.id ?? 'new'}-${modalState.isOpen}`}
        open={modalState.isOpen}
        mode={modalState.mode}
        hte={modalState.selectedHte}
        permissions={permissions}
        viewerRole={user?.role}
        supervisorOptions={supervisorOptions}
        onClose={modalState.close}
        onSuccess={notify.success}
        onCreate={createHte.mutateAsync}
        onUpdate={updateHte.mutateAsync}
        onSupervisorChange={updateHteSupervisor.mutateAsync}
        onStatusChange={updateStatus.mutateAsync}
      />
    </Box>
  )
}
