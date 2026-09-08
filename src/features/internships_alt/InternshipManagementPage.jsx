import React from "react";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

// Reusable custom layout and stats components
import CardStat from "../../components/common/CardStat";

// Refactored features components and hooks
import InternshipsTable from "./components/InternshipsTable";
import InternshipModal from "./components/InternshipModal";
import { useModalState } from "./hooks/useModalState";
import { useInternships, useInternshipMutations } from "./hooks/useInternshipMutations";
import { useUsers } from "../users/hooks/useUsers";
import { getInternshipManagementPermissions } from "./internshipPermissions";
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

export default function InternshipManagementPage() {
  const { user } = useAuth();
  const permissions = {
    ...getInternshipManagementPermissions(user?.role),
    role: user?.role,
  };
  const modalState = useModalState();
  const { data: internships = [], isLoading, isError, error, refetch } = useInternships({
    enabled: permissions.canView,
  });
  const { data: usersData = [] } = useUsers({ enabled: permissions.canView });
  const {
    createInternship,
    updateInternship,
    assignAdviser,
    updateStatus,
    bulkUpdateStatus,
  } = useInternshipMutations();

  const stats = {
    active: internships.filter((internship) => internship.status === "active").length,
    pending: internships.filter((internship) => internship.status === "pending").length,
    completed: internships.filter((internship) => internship.status === "completed").length,
    htes: new Set(internships.map((internship) => internship.hte_id || internship.hteId)).size,
  };

  return (
    <div style={styles.container}>
      {/* ==================== TOP SECTION ==================== */}
      <div style={styles.topSection}>
        {/* Header: Title + Primary Action Button */}
        <div style={styles.headerSection}>
          <Typography variant="h5" fontWeight={600}>
            Internships by Status
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => modalState.open("create")}
            disabled={!permissions.canCreate}
          >
            Add Internship
          </Button>
        </div>

        {/* Stats Cards Dashboard */}
        <div style={styles.cardsSection}>
          <CardStat title="Active Interns" value={stats.active} />
          <CardStat title="Pending Interns" value={stats.pending} />
          <CardStat title="Completed Internships" value={stats.completed} />
          <CardStat title="HTE Partners" value={stats.htes} />
        </div>
      </div>

      {/* ==================== MAIN SECTION ==================== */}
      <div style={styles.mainSection}>
        {/* Table Title Header */}
        <div style={styles.tableHeader}>
          <Typography variant="h5" fontWeight={600}>
            Internship List
          </Typography>
        </div>

        {/* Data Grid Table Container */}
        <div style={styles.tableContainer}>
          {!permissions.canView ? (
            <Alert severity="error">
              You do not have permission to view internships.
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
                "Unable to load internships. Please try again."}
            </Alert>
          ) : internships.length === 0 ? (
            <Alert
              severity="info"
              action={
                permissions.canCreate ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => modalState.open("create")}
                  >
                    Add internship
                  </Button>
                ) : undefined
              }
            >
              No internships found.
            </Alert>
          ) : (
            <InternshipsTable
              internships={internships}
              users={usersData}
              permissions={permissions}
              onFacultyAdviserChange={assignAdviser.mutateAsync}
              onStatusChange={updateStatus.mutateAsync}
              onBulkStatusChange={bulkUpdateStatus.mutateAsync}
              onEditRow={(internship) => modalState.open("edit", internship)}
            />
          )}
        </div>
      </div>

      {/* ==================== DIALOGS / MODALS ==================== */}
      {permissions.canView && modalState.isOpen && (
        <InternshipModal
          key={`${modalState.mode}-${modalState.selectedEntity?.id ?? "new"}-${
            modalState.isOpen
          }`}
          open={modalState.isOpen}
          mode={modalState.mode}
          internship={modalState.selectedEntity}
          permissions={permissions}
          onClose={modalState.close}
          onSuccess={(message) => {
            notify.success(message);
            modalState.close();
          }}
          onCreate={createInternship.mutateAsync}
          onUpdate={updateInternship.mutateAsync}
          onFacultyAdviserChange={assignAdviser.mutateAsync}
          onStatusChange={updateStatus.mutateAsync}
        />
      )}
    </div>
  );
}
