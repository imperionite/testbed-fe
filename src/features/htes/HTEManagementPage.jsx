import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardStat from "../../components/common/CardStat";
import HteTable from "./components/HteTable";
import HteModal from "./components/HteModal";
import { useHteModalState } from "./hooks/useHteModalState";
import useAuth from "../../hooks/useAuth";
import { useHtes } from "./hooks/useHtes";
import { useHteMutations } from "./hooks/useHteMutations";
import { getHteManagementPermissions } from "./htePermissions";
import { useUsers } from "../users/hooks/useUsers";
import notify from "../../utils/toast";

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: "100vh",
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
    paddingTop: "10px",
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
export default function HteManagementLayout() {
  const { user } = useAuth();
  const permissions = getHteManagementPermissions(user?.role);

  const {
    data: hteData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHtes({
    enabled: permissions.canView,
  });

  // Supervisor Mapping Block
  const { data: allUsers = [] } = useUsers({
    enabled: permissions.canView,
  });

  const supervisorOptions = allUsers.filter(
    (u) => u.role === "hte_supervisor" && u.is_active === true,
  );

  const supervisorMap = Object.fromEntries(
    allUsers.map((u) => [
      u.id,
      [u.last_name, u.first_name].filter(Boolean).join(", "),
    ]),
  );

  const modalState = useHteModalState();
  const {
    createHte,
    updateHte,
    updateHteSupervisor,
    updateStatus,
    bulkUpdateStatus,
  } = useHteMutations();

  return (
    <div style={styles.container}>
      {/* ==================== TOP SECTION ==================== */}
      <div style={styles.topSection}>
        {/* Header: Title + Action Button */}
        <div style={styles.headerSection}>
          <Typography variant="h5" fontWeight={600}>
          Host Training Establishments (HTE)
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => modalState.open("create")}
            disabled={!permissions.canCreate}
          >
            Register HTE
          </Button>
        </div>

        {/* Stats Cards */}
        <div style={styles.cardsSection}>
          <CardStat title="Total HTE Partners" value={hteData.length} />
          <CardStat
            title="Active HTE Partners"
            value={hteData.filter((u) => u.is_active === true).length}
          />
        </div>
      </div>

      {/* ==================== MAIN SECTION ==================== */}
      <div style={styles.mainSection}>
        {/* Table Header */}
        <div style={styles.tableHeader}>
        </div>

        {/* Data Table */}
        <div style={styles.tableContainer}>
          {!permissions.canView ? (
            <Alert severity="error">
              You do not have permission to view HTEs.
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
                "Unable to load HTEs. Please try again."}
            </Alert>
          ) : hteData.length === 0 ? (
            <Alert
              severity="info"
              action={
                permissions.canCreate ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => modalState.open("create")}
                  >
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
              onSupervisorChange={updateHteSupervisor.mutateAsync}
              onStatusChange={updateStatus.mutateAsync}
              onBulkStatusChange={bulkUpdateStatus.mutateAsync}
              onHteClick={(selectedHte) => modalState.open("view", selectedHte)}
            />
          )}
        </div>
      </div>

      {permissions.canView && (
        <HteModal
          key={`${modalState.mode}-${modalState.selectedHte?.id ?? "new"}-${modalState.isOpen}`}
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
      )}
    </div>
  );
}
