import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardStat from "../../components/common/CardStat";
import EvaluationTable from "./components/EvaluationTable";
import EvaluationModal from "./components/EvaluationModal";
import { useEvaluationModalState } from "./hooks/useEvaluationsModalState";
import useAuth from "../../hooks/useAuth";
import { useEvaluations, useInternEvaluations } from "./hooks/useEvaluations";
import { useEvaluationMutations } from "./hooks/useEvaluationMutations";
import { getEvaluationManagementPermissions } from "./evaluationPermissions";
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
export default function EvaluationManagementPage() {
  const { user } = useAuth();
  const permissions = getEvaluationManagementPermissions(user?.role);
  const isHteSupervisor = permissions.canViewMyEvaluationsList;
  const isStudent = user?.role === "student";

  const myEvaluationsQuery = useEvaluations({
    enabled: isHteSupervisor,
  });

  const internEvaluationsQuery = useInternEvaluations(user?.id, {
    enabled: isStudent && Boolean(user?.id),
  });

  const evaluations = isHteSupervisor
    ? myEvaluationsQuery.data ?? []
    : internEvaluationsQuery.data ?? [];
  const activeQuery = isHteSupervisor
    ? myEvaluationsQuery
    : internEvaluationsQuery;
  const {
    isLoading,
    isError,
    error,
    refetch,
  } = activeQuery;

  const { data: allUsers = [] } = useUsers({
    enabled: isHteSupervisor,
  });

  const internOptions = allUsers.filter(
    (u) => u.role === "student" && u.is_active === true,
  );

  const internMap = Object.fromEntries(
    allUsers.map((u) => [
      u.id,
      [u.last_name, u.first_name].filter(Boolean).join(", "),
    ]),
  );

  const modalState = useEvaluationModalState();
  const {
    createEvaluation,
    updateEvaluation,
    bulkSubmitEvaluations,
  } = useEvaluationMutations();

  return (
    <div style={styles.container}>
      {/* ==================== TOP SECTION ==================== */}
      <div style={styles.topSection}>
        {/* Header: Title + Action Button */}
        <div style={styles.headerSection}>
          <Typography variant="h5" fontWeight={600}>
          Evaluations
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => modalState.open("create")}
            disabled={!permissions.canCreate}
          >
            New Evaluation
          </Button>
        </div>

        {/* Stats Cards */}
        <div style={styles.cardsSection}>
          <CardStat title="Total Evaluations" value={evaluations.length} />
          <CardStat
            title="Draft Evaluations"
            value={evaluations.filter((evaluation) => evaluation.status === "Draft").length}
          />
          <CardStat
            title="Submitted Evaluations"
            value={evaluations.filter((evaluation) => evaluation.status === "Submitted").length}
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
              You do not have permission to view evaluations.
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
                "Unable to load evaluations. Please try again."}
            </Alert>
          ) : evaluations.length === 0 ? (
            <Alert
              severity="info"
              action={
                permissions.canCreate ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => modalState.open("create")}
                  >
                    New Evaluation
                  </Button>
                ) : undefined
              }
            >
              No evaluations found.
            </Alert>
          ) : (
            <EvaluationTable
              evaluations={evaluations}
              permissions={permissions}
              internMap={internMap}
              onBulkStatusChange={bulkSubmitEvaluations.mutateAsync}
              onEvaluationClick={(selectedEvaluation) =>
                modalState.open("view", selectedEvaluation)
              }
            />
          )}
        </div>
      </div>

      {permissions.canView && (
        <EvaluationModal
          key={`${modalState.mode}-${modalState.selectedRecord?.id ?? "new"}-${modalState.isOpen}`}
          open={modalState.isOpen}
          mode={modalState.mode}
          evaluation={modalState.selectedRecord}
          permissions={permissions}
          viewerRole={user?.role}
          internOptions={internOptions}
          onClose={modalState.close}
          onSuccess={notify.success}
          onCreate={createEvaluation.mutateAsync}
          onUpdate={updateEvaluation.mutateAsync}
        />
      )}
    </div>
  );
}
