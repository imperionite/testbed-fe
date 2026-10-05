import { Button, Grid, Box, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

import CardStat from '../shared/components/CardStat'
// import GuardTableContent from '../shared/components/GuardTableContent'

import UsersTable from './components/UsersTable'
import UserModal from './components/UserModal'
import { useModalState } from '../shared/hooks/useModalState'
import { useUsers } from './hooks/useUsers'
import { useUserMutations } from './hooks/useUserMutations'
import { useUiPermissions } from '../shared/hooks/useUiPermissions'
import PageTitleAndSubtitle from '../shared/components/PageTitleAndSubtitle'

import notify from '../../utils/toast'

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function UserManagementPage() {
  const { isAdmin, isAdminOrCoordinator, isCoordinator } = useUiPermissions()
  const canView = isAdminOrCoordinator // Based on original permissions: isAdmin || isCoordinator

  // 1. Hook for fetching data (Query)
  const {
    data: userData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({
    enabled: canView,
  })

  // 2. Hook for centralized modal/dialog state management
  const modalState = useModalState()

  // 3. Hook for asynchronous user data mutations
  const { createUser, updateUser, updateRole, updateStatus, bulkUpdateRole, bulkUpdateStatus } =
    useUserMutations()

  const permissions = {
    canView,
    canCreate: isAdmin,
    canEdit: isAdmin,
    canChangeRole: isAdmin,
    canChangeStatus: isAdmin,
    canBulkEdit: isAdmin,
    canSelectRows: isAdmin,
  }

  return (
    <Box>
      {/* ==================== TOP SECTION ==================== */}
      <Box>
        {/* Header: Title + Primary Action Button */}
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
            title="Active Accounts by Role"
            subtitle={
              isAdmin
                ? 'Manage system accounts and user roles.'
                : isCoordinator
                  ? 'View system accounts and user roles.'
                  : ' '
            }
          />

          {permissions.canCreate && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => modalState.open('create')}
            >
              Add User
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={1}>
          <Grid
            size={{
              xs: 6,
              md: 3,
              lg: 2.4,
            }}
          >
            <CardStat
              sx={{ height: '100%' }}
              title="Students"
              value={userData.filter((u) => u.isActive === true && u.role === 'student').length}
            />
          </Grid>

          <Grid
            size={{
              xs: 6,
              md: 3,
              lg: 2.4,
            }}
          >
            <CardStat
              sx={{ height: '100%' }}
              title="Administrators"
              value={
                userData.filter((u) => u.isActive === true && u.role === 'administrator').length
              }
            />
          </Grid>

          <Grid
            size={{
              xs: 6,
              md: 3,
              lg: 2.4,
            }}
          >
            <CardStat
              sx={{ height: '100%' }}
              title="HTE Supervisors"
              value={
                userData.filter((u) => u.isActive === true && u.role === 'hte_supervisor').length
              }
            />
          </Grid>

          <Grid
            size={{
              xs: 6,
              md: 3,
              lg: 2.4,
            }}
          >
            <CardStat
              sx={{ height: '100%' }}
              title="Faculty Advisers"
              value={
                userData.filter((u) => u.isActive === true && u.role === 'faculty_adviser').length
              }
            />
          </Grid>

          <Grid
            size={{
              xs: 6,
              md: 3,
              lg: 2.4,
            }}
          >
            <CardStat
              sx={{ height: '100%' }}
              title="Internship Coordinators"
              value={
                userData.filter((u) => u.isActive === true && u.role === 'internship_coordinator')
                  .length
              }
            />
          </Grid>
        </Grid>
      </Box>

      {/* ==================== MAIN SECTION ==================== */}
      <Box sx={{ mt: { xs: 4, lg: 5 } }}>
        {/* Table Title Header */}
        <PageTitleAndSubtitle title="User List" />

        {/* Error Banner */}
        {isError ? (
          <Alert
            severity="error"
            onClose={refetch}
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            Failed to load records. {error?.message}
          </Alert>
        ) : (
          <UsersTable
            users={userData}
            isLoading={isLoading}
            permissions={permissions}
            onRoleChange={updateRole.mutateAsync}
            onStatusChange={updateStatus.mutateAsync}
            onBulkRoleChange={bulkUpdateRole.mutateAsync}
            onBulkStatusChange={bulkUpdateStatus.mutateAsync}
            onEditRow={(selectedUser) => modalState.open('edit', selectedUser)}
          />
        )}
      </Box>

      {/* ==================== MODAL ==================== */}
      {permissions.canView && modalState.isOpen && (
        <UserModal
          key={`${modalState.mode}-${modalState.selectedEntity?.id ?? 'new'}-${modalState.isOpen}`}
          open={modalState.isOpen}
          mode={modalState.mode}
          user={modalState.selectedEntity}
          permissions={permissions}
          mutations={{
            createUser,
            updateUser,
            updateRole,
            updateStatus,
          }}
          onClose={modalState.close}
          onSuccess={notify.success}
        />
      )}
    </Box>
  )
}
