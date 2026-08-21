import { Alert, Button, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardStat from "../../components/common/CardStat";
import DarkButton from "../../components/common/ButtonDark";
import UsersTable from "./components/UsersTable";
import UserModal from "./components/UserModal";
import { useUserModalState } from "./hooks/userUserModalState";
import useAuth from "../../hooks/useAuth";
import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";
import { getUserManagementPermissions } from "./userPermissions";
import notify from "../../utils/toast";

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    background: "#F7F9FB",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    width: "100%",
  },
  mainSection: {
    paddingTop: "24px",
  },
  tableHeader: {
    marginBottom: "16px",
  },
  tableContainer: {
    width: "100%",
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function UserManagementLayout() {
  const { user } = useAuth();
  const permissions = getUserManagementPermissions(user?.role);
  const {
    data: userData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({
    enabled: permissions.canView,
  });
  const modalState = useUserModalState();
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
        {/* Header: Title + Action Button */}
        <div style={styles.headerSection}>
          <h4>Active Accounts by Role</h4>
          <DarkButton
            icon={<AddIcon />}
            onClick={() => modalState.open("create")}
            disabled={!permissions.canCreate}
          >
            Add User
          </DarkButton>
        </div>

        {/* Stats Cards */}
        <div style={styles.cardsSection}>
          <CardStat
            title="Students"
            value={userData.filter((u) => u.role === "student").length}
          />
          <CardStat
            title="Administrators"
            value={userData.filter((u) => u.role === "administrator").length}
          />
          <CardStat
            title="HTE Supervisors"
            value={userData.filter((u) => u.role === "hte_supervisor").length}
          />
          <CardStat
            title="Faculty Advisers"
            value={userData.filter((u) => u.role === "faculty_adviser").length}
          />
          <CardStat
            title="Internship Coordinators"
            value={
              userData.filter((u) => u.role === "internship_coordinator").length
            }
          />
        </div>
      </div>

      {/* ==================== MAIN SECTION ==================== */}
      <div style={styles.mainSection}>
        {/* Table Header */}
        <div style={styles.tableHeader}>
          <h4>User List</h4>
        </div>

        {/* Data Table */}
        <div style={styles.tableContainer}>
          {!permissions.canView ? (
            <Alert severity="error">
              You do not have permission to view users.
            </Alert>
          ) : isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
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
              onUserClick={(selectedUser) =>
                modalState.open("view", selectedUser)
              }
            />
          )}
        </div>
      </div>

      {permissions.canView && (
        <UserModal
          key={`${modalState.mode}-${modalState.selectedUser?.id ?? "new"}-${modalState.isOpen}`}
          open={modalState.isOpen}
          mode={modalState.mode}
          user={modalState.selectedUser}
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