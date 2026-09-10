import { Box, Typography, Button, Alert, CircularProgress, Stack, IconButton, Tooltip } from "@mui/material";
import { Add as AddIcon, FilterList as FilterListIcon, Edit as EditIcon, PersonAdd as PersonAddIcon, EditNote as EditNoteIcon, History as HistoryIcon } from "@mui/icons-material";
import { useMaterialReactTable } from "@glebcha/material-react-table";
import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "../../api/attendance";
import CardStat from "../../components/common/CardStat";
import InternshipTable from "./components/InternshipTable";
import InternshipModal from "./components/InternshipModal";
import { BadgeStatus } from "./components/BadgeStatus";
import AttendanceViewModal from "../attendance/components/AttendanceViewModal";
import { useInternships, useInternshipMutations } from "./hooks/useInternshipMutations";
import { useTableActions } from "./hooks/useTableActions";
import useAuth from "../../hooks/useAuth";
import { MODES } from "./form/formConfig";

function ProgressCell({ internshipId, requiredHours }) {
  const { data, isLoading } = useQuery({
    queryKey: ["renderedHours", internshipId],
    queryFn: () => attendanceApi.getRenderedHours(internshipId),
    enabled: !!internshipId,
  });
  
  if (isLoading) return "Loading...";
  return `${data?.totalHours || 0} / ${requiredHours || 0} hours`;
}

export default function InternshipManagementPage() {
  const { user } = useAuth();
  const [modalState, setModalState] = useState({ open: false, mode: MODES.CREATE, internship: null });
  const [attendanceModalState, setAttendanceModalState] = useState({ open: false, internship: null });
  
  const { data: internships = [], isLoading, isError, refetch } = useInternships();
  const { createInternship, updateStatus, assignAdviser, updateInternship } = useInternshipMutations();

  // Integrated Table Actions
  const { handleBulkStatusChange } = useTableActions({
    permissions: { canEdit: true, canBulkEdit: true },
    onStatusChange: (data) => updateStatus.mutateAsync(data),
    onBulkStatusChange: async ({ ids, status }) => {
        await Promise.all(ids.map(id => updateStatus.mutateAsync({ id, status })));
    }
  });

  const handleOpenModal = (mode, internship = null) => {
    setModalState({ open: true, mode, internship });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, mode: MODES.CREATE, internship: null });
  };

  const handleCreate = async (data) => {
      await createInternship.mutateAsync(data);
      handleCloseModal();
  };

  const handleOpenAttendance = (internship) => {
    setAttendanceModalState({ open: true, internship });
  };

  const handleCloseAttendance = () => {
    setAttendanceModalState({ open: false, internship: null });
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
        Cell: ({ row }) => (
            <ProgressCell internshipId={row.original.id} requiredHours={row.original.required_hours} />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
            <BadgeStatus value={cell.getValue()} />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Update Status">
              <IconButton size="small" onClick={() => handleOpenModal(MODES.EDIT_STATUS, row.original)}>
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Assign Adviser">
              <IconButton size="small" onClick={() => handleOpenModal(MODES.EDIT_ADVISER, row.original)}>
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Details">
              <IconButton size="small" onClick={() => handleOpenModal(MODES.EDIT_DETAILS, row.original)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Attendance">
              <IconButton size="small" onClick={() => handleOpenAttendance(row.original)}>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Stack>
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
        displayColumnDefOptions: {
          "mrt-row-actions": { size: 100 },
        },
        muiPaginationProps: {
            showFirstButton: false,
            showLastButton: false,
        },
      });

      const handleUpdateStatus = async (data) => {
      await updateStatus.mutateAsync({ id: modalState.internship.id, status: data.status });
      handleCloseModal();
      };

      const handleAssignAdviser = async (data) => {
      await assignAdviser.mutateAsync({ id: modalState.internship.id, facultyAdviserId: data.facultyAdviserId || null });
      handleCloseModal();
      };

      const handleUpdateDetails = async (data) => {
      await updateInternship.mutateAsync({ id: modalState.internship.id, payload: data });
      handleCloseModal();
      };

      return (
      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight={600}>Internship Overview</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal(MODES.CREATE)}>
                Add New Intern
            </Button>
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
            <Button variant="outlined" startIcon={<FilterListIcon />}
                onClick={() => table.setShowColumnFilters(!table.getState().showColumnFilters)}
            >
                Filters
            </Button>
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
            onUpdateStatus={handleUpdateStatus}
            onAssignAdviser={handleAssignAdviser}
            onUpdateDetails={handleUpdateDetails}
            onCreate={handleCreate}
        />
        <AttendanceViewModal 
            open={attendanceModalState.open}
            onClose={handleCloseAttendance}
            internshipId={attendanceModalState.internship?.id}
        />
      </Box>
      );
      }