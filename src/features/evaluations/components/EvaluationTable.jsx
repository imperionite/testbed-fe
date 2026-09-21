import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "@glebcha/material-react-table";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

import { createEvaluationTableColumns } from "./evaluationTableColumns";
import ActionConfirmDialog from "../../shared/components/ActionConfirmDialog";

export default function EvaluationsTable({
  evaluations,
  permissions,
  internMap = {},
  onEvaluationClick,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // const askForConfirmation = (message) =>
  //   new Promise((resolve) => {
  //     setConfirmation({ message, resolve });
  //   });

  const closeConfirmation = (confirmed) => {
    confirmation?.resolve(confirmed);
    setConfirmation(null);
  };

  const columns = useMemo(
    () =>
      createEvaluationTableColumns({
        internMap,
      }),
    [internMap],
  );

  const selectedRowCount = Object.keys(rowSelection).length;

  const table = useMaterialReactTable({
    columns,
    data: evaluations,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableRowSelection: permissions.canSelectRows,
    enableHiding: true,
    enableClickToCopy: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableDensityToggle: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableEditing: false,
    enableRowActions: permissions.canEdit,
    positionActionsColumn: "last",
    positionGlobalFilter: "right",
    initialState: {
      columnFiltersOpen: false,
      pagination: { pageIndex: 0, pageSize: 5 },
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: {
      right: ["mrt-row-actions"],
      },
    },
    icons: {
      SaveIcon: (props) =>
        pendingAction ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <CheckIcon
            {...props}
            sx={{ ...props.sx, color: "success.main" }}
          />
        ),
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 104,
        muiTableBodyCellProps: {
          sx: {
            minWidth: 104,
            whiteSpace: "nowrap",
          },
        },
      },
    },
    state: {
      rowSelection,
      columnVisibility: {
        ...columnVisibility,
        "mrt-row-actions": selectedRowCount === 0,
      },
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    muiTableContainerProps: {
      sx: {
        maxHeight: 600,
        maxWidth: "100%",
        overflowX: "auto",
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        position: "sticky",
        top: 0,
        zIndex: 2,
      },
    },
    renderRowActions: ({ row }) => (
      <Tooltip title={row.original.status?.toLowerCase() === "draft" ? "Edit evaluation" : "View evaluation"}>
        <IconButton
          aria-label={`${row.original.status?.toLowerCase() === "draft" ? "Edit" : "View"} evaluation`}
          onClick={(event) => {
            event.stopPropagation();
            onEvaluationClick?.(row.original);
          }}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
    // renderBottomToolbarCustomActions: ({ table: currentTable }) =>
    //   permissions.canBulkEdit ? (
    //     <Box sx={{ display: "flex", gap: 1 }}>
    //       <Button
    //         size="small"
    //         variant="contained"
    //         disabled={
    //           pendingAction !== null ||
    //           !currentTable
    //             .getSelectedRowModel()
    //             .rows.some((row) => row.original.status === "Draft")
    //         }
    //         onClick={async () => {
    //           const ids = currentTable
    //             .getSelectedRowModel()
    //             .rows
    //             .filter((row) => row.original.status === "Draft")
    //             .map((row) => row.original.id);

    //           if (!ids.length || !(await askForConfirmation("Are you sure you want to submit the selected draft evaluations? Once an evaluation is submitted, it is final and cannot be undone."))) {
    //             return;
    //           }

    //           setPendingAction("bulk-submit");
    //           try {
    //             await onBulkStatusChange({ ids });
    //             notify.success("Evaluations submitted successfully.");
    //           } catch (error) {
    //             console.error("Failed to submit evaluations:", error);
    //             notify.error(
    //               error.response?.data?.message || "Failed to submit evaluations.",
    //             );
    //           } finally {
    //             setPendingAction(null);
    //           }
    //         }}
    //         startIcon={pendingAction === "bulk-submit" ? <CircularProgress size={16} /> : null}
    //       >
    //         {pendingAction === "bulk-submit" ? "Submitting..." : "Submit drafts"}
    //       </Button>
    //     </Box>
    //   ) : null,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <ActionConfirmDialog
        open={Boolean(confirmation)}
        message={confirmation?.message}
        onConfirm={() => closeConfirmation(true)}
        onCancel={() => closeConfirmation(false)}
      />
    </>
  );
}
