import React from "react";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

// Reusable custom layout and stats components
import CardStat from "../../components/common/CardStat";

// Refactored features components and hooks
import UsersTable from "./components/UsersTable";
import UserModal from "./components/UserModal";
import { useModalState } from "./hooks/useModalState";
import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";
import { getUserManagementPermissions } from "./userPermissions";

import useAuth from "../../hooks/useAuth";
import notify from "../../utils/toast";

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: "100vh",
  },
  topSection: {
    padding: "0px",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "20px",
  },
  cardsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: 10,
    width: "100%",
  },
  mainSection: {
    paddingTop: "43px",
  },
  tableHeader: {
    marginBottom: "16px",
  },
  tableContainer: {
    width: "100%",
  },
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function UserManagementPage() {
  const { user } = useAuth();
  const permissions = getUserManagementPermissions(user?.role);

  // 1. Hook for fetching data (Query)
  const {
    data: userData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({
    enabled: permissions.canView,
  });

  // 2. Hook for centralized modal/dialog state management
  const modalState = useModalState();

  // 3. Hook for asynchronous user data mutations
  const {
    createUser,
    updateUser,
    updateRole,
    updateStatus,
    bulkUpdateRole,
    bulkUpdateStatus,
  } = useUserMutations();

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
            onClick={() => modalState.open("create")}
            disabled={!permissions.canCreate}
          >
            Add User
          </Button>
        </div>

        {/* Stats Cards Dashboard */}
        <div style={styles.cardsSection}>
          <CardStat
            title="Students"
            value={
              userData.filter(
                (u) => u.isActive === true && u.role === "student"
              ).length
            }
          />
          <CardStat
            title="Administrators"
            value={
              userData.filter(
                (u) => u.isActive === true && u.role === "administrator"
              ).length
            }
          />
          <CardStat
            title="HTE Supervisors"
            value={
              userData.filter(
                (u) => u.isActive === true && u.role === "hte_supervisor"
              ).length
            }
          />
          <CardStat
            title="Faculty Advisers"
            value={
              userData.filter(
                (u) => u.isActive === true && u.role === "faculty_adviser"
              ).length
            }
          />
          <CardStat
            title="Internship Coordinators"
            value={
              userData.filter(
                (u) =>
                  u.isActive === true && u.role === "internship_coordinator"
              ).length
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
          {!permissions.canView ? (
            <Alert severity="error">
              You do not have permission to view users.
            </Alert>
          ) : isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              <CircularProgress size={28} />
            </div>
          ) : isError ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={refetch}>
                  Retry
                </Button>
              }
            >
              {error?.response?.data?.message ||
                "Unable to load users. Please try again."}
            </Alert>
          ) : userData.length === 0 ? (
            <Alert
              severity="info"
              action={
                permissions.canCreate ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => modalState.open("create")}
                  >
                    Add user
                  </Button>
                ) : undefined
              }
            >
              No users found.
            </Alert>
          ) : (
            <UsersTable
              users={userData}
              permissions={permissions}
              onRoleChange={updateRole.mutateAsync}
              onStatusChange={updateStatus.mutateAsync}
              onBulkRoleChange={bulkUpdateRole.mutateAsync}
              onBulkStatusChange={bulkUpdateStatus.mutateAsync}
              onEditRow={(selectedUser) =>
                modalState.open("edit", selectedUser)
              }
            />
          )}
        </div>
      </div>

      {/* ==================== DIALOGS / MODALS ==================== */}
      {permissions.canView && modalState.isOpen && (
        <UserModal
          key={`${modalState.mode}-${modalState.selectedEntity?.id ?? "new"}-${
            modalState.isOpen
          }`}
          open={modalState.isOpen}
          mode={modalState.mode}
          user={modalState.selectedEntity}
          permissions={permissions}
          onClose={modalState.close}
          onSuccess={notify.success}
          onCreate={createUser.mutateAsync}
          onUpdate={updateUser.mutateAsync}
          onRoleChange={updateRole.mutateAsync}
          onStatusChange={updateStatus.mutateAsync}
        />
      )}
    </div>
  );
}
