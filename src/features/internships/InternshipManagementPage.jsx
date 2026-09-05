import { Box, Typography, Button, Alert, CircularProgress, Stack } from "@mui/material";
import { Add as AddIcon, FilterList as FilterListIcon } from "@mui/icons-material";
import { useMaterialReactTable } from "@glebcha/material-react-table";
import { useMemo, useState } from "react";
import CardStat from "../../components/common/CardStat";
import InternshipTable from "./components/InternshipTable";
import InternshipModal from "./components/InternshipModal";
import { useInternships } from "./hooks/useInternshipMutations";
import useAuth from "../../hooks/useAuth";
import { MODES } from "./form/formConfig";

export default function InternshipManagementPage() {
  const { user } = useAuth();
  const [modalState, setModalState] = useState({ open: false, mode: MODES.CREATE, internship: null });
  
  const { data: internships = [], isLoading, isError, refetch } = useInternships();

  const handleOpenModal = (mode, internship = null) => {
    setModalState({ open: true, mode, internship });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, mode: MODES.CREATE, internship: null });
  };

  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => {
          const profile = row.student_profiles || {};
          const firstName = profile.firstName || profile.first_name || "";
          const middleName = profile.middleName || profile.middle_name || "";
          const lastName = profile.lastName || profile.last_name || "";

          const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
          
          return fullName.trim() || profile.student_number || "N/A";
        },
        Cell: ({ row }) => {
          const profile = row.original.student_profiles || {};
          const firstName = profile.firstName || profile.first_name || "";
          const middleName = profile.middleName || profile.middle_name || "";
          const lastName = profile.lastName || profile.last_name || "";

          const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
          
          return (
            <Box>
              <Typography variant="body2">{fullName.trim() || "N/A"}</Typography>
              <Typography variant="caption" color="text.secondary">{profile.student_number}</Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "hte_profiles.company_name",
        header: "HTE Partner",
      },
      {
        accessorKey: "student_profiles.program",
        header: "Program",
      },
      {
        accessorKey: "internship_period",
        header: "Internship Period",
        Cell: () => "TBD",
      },
      {
        accessorKey: "progress",
        header: "Progress",
        Cell: ({ row }) => `0 / ${row.original.required_hours || 0} hours`,
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
            <Box sx={{textTransform: 'capitalize'}}>
                {cell.getValue()}
            </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: internships,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableHiding: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => [
        <Button key="view" onClick={() => handleOpenModal(MODES.VIEW, row.original)}>View</Button>,
        <Button key="edit" onClick={() => handleOpenModal("edit", row.original)}>Edit</Button>
    ],
    displayColumnDefOptions: {
      "mrt-row-actions": { size: 150 },
    },
    muiPaginationProps: {
        showFirstButton: false,
        showLastButton: false,
    },
  });

  // RBAC: Only Admin/Coordinator can manage
  const canManage = user?.role === "administrator" || user?.role === "internship_coordinator";

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Internship Overview</Typography>
        {canManage && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal(MODES.CREATE)}>
            Add New Intern
          </Button>
        )}
      </Box>

      {/* Summary Metrics */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <CardStat title="Deployed Interns" value={internships.filter(i => i.status === 'active').length} />
        <CardStat title="Pending Interns" value={internships.filter(i => i.status === 'pending').length} />
        <CardStat title="Completed Internships" value={internships.filter(i => i.status === 'completed').length} />
        <CardStat title="HTE Partners" value={new Set(internships.map(i => i.hte_id)).size} />
      </Stack>

      {/* Toolbar & Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Interns List</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<FilterListIcon />}
            onClick={() => table.setShowColumnFilters(!table.getState().showColumnFilters)}
          >
            Filters
          </Button>
        </Stack>
      </Box>

      {/* Data Table */}
      {isLoading ? (
        <CircularProgress/>
      ) : isError ? (
        <Alert action={<Button onClick={refetch} color="inherit" size="small">Retry</Button>} severity="error">Error loading data</Alert>
      ) : (
        <InternshipTable table={table}/>
      )}

      <InternshipModal 
        open={modalState.open} 
        mode={modalState.mode} 
        internship={modalState.internship}
        onClose={handleCloseModal} 
      />
    </Box>
  );
}
