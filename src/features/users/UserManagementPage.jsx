import React from 'react'
import { Button, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

// Reusable layout and components
import CardStat from '../shared/components/CardStat'
import GuardTableContent from '../shared/components/GuardTableContent'

// Refactored features components and hooks
import UsersTable from './components/UsersTable'
import UserModal from './components/UserModal'
import { useModalState } from '../shared/hooks/useModalState'
import { useUsers } from './hooks/useUsers'
import { useUserMutations } from './hooks/useUserMutations'
import { getUserManagementPermissions } from './userPermissions'

import useAuth from '../../hooks/useAuth'
import notify from '../../utils/toast'

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
  },
  topSection: {
    padding: '0px',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  cardsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: 10,
    width: '100%',
  },
  mainSection: {
    paddingTop: '43px',
  },
  tableHeader: {
    marginBottom: '16px',
  },
  tableContainer: {
    width: '100%',
  },
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function UserManagementPage() {
  const { user } = useAuth()
  const permissions = getUserManagementPermissions(user?.role)

  // 1. Hook for fetching data (Query)
  const {
    data: userData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({
    enabled: permissions.canView,
  })

  // 2. Hook for centralized modal/dialog state management
  const modalState = useModalState()

  // 3. Hook for asynchronous user data mutations
  const { createUser, updateUser, updateRole, updateStatus, bulkUpdateRole, bulkUpdateStatus } =
    useUserMutations()

  return (
    <div style={styles.container}>
      {/* ==================== TOP SECTION ==================== */}
      <div style={styles.topSection}>
        {/* Header: Title + Primary Action Button */}
        <div style={styles.headerSection}>
          <Typography variant="h5" fontWeight={600}>
            Active Accounts by Role
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => modalState.open('create')}
            disabled={!permissions.canCreate}
          >
            Add User
          </Button>
        </div>

        {/* Stats Cards Dashboard */}
        <div style={styles.cardsSection}>
          <CardStat
            title="Students"
            value={userData.filter((u) => u.isActive === true && u.role === 'student').length}
          />
          <CardStat
            title="Administrators"
            value={userData.filter((u) => u.isActive === true && u.role === 'administrator').length}
          />
          <CardStat
            title="HTE Supervisors"
            value={
              userData.filter((u) => u.isActive === true && u.role === 'hte_supervisor').length
            }
          />
          <CardStat
            title="Faculty Advisers"
            value={
              userData.filter((u) => u.isActive === true && u.role === 'faculty_adviser').length
            }
          />
          <CardStat
            title="Internship Coordinators"
            value={
              userData.filter((u) => u.isActive === true && u.role === 'internship_coordinator')
                .length
            }
          />
        </div>
      </div>

      {/* ==================== MAIN SECTION ==================== */}
      <div style={styles.mainSection}>
        {/* Table Title Header */}
        <div style={styles.tableHeader}>
          <Typography variant="h5" fontWeight={600}>
            User List
          </Typography>
        </div>

        {/* Data Grid Table Container */}
        <div style={styles.tableContainer}>
          <GuardTableContent
            canView={permissions.canView}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={userData.length === 0}
            resourceName="users"
            onRetry={refetch}
            onAdd={permissions.canCreate ? () => modalState.open('create') : undefined}
          >
            <UsersTable
              users={userData}
              permissions={permissions}
              onRoleChange={updateRole.mutateAsync}
              onStatusChange={updateStatus.mutateAsync}
              onBulkRoleChange={bulkUpdateRole.mutateAsync}
              onBulkStatusChange={bulkUpdateStatus.mutateAsync}
              onEditRow={(selectedUser) => modalState.open('edit', selectedUser)}
            />
          </GuardTableContent>
        </div>
      </div>

      {/* ==================== DIALOGS / MODALS ==================== */}
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
    </div>
  )
}
