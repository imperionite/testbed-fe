import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "@glebcha/material-react-table";
import { Box, Button, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { createHteTableColumns } from "./hteTableColumns";
import notify from "../../../utils/toast";
import ActionConfirmDialog from "../../../components/common/ActionConfirmDialog";

export default function HtesTable({
  htes,
  permissions,
  supervisorMap = {},
  onStatusChange,
  onBulkStatusChange,
  onHteClick,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const askForConfirmation = (message) =>
    new Promise((resolve) => {
      setConfirmation({ message, resolve });
    });

  const closeConfirmation = (confirmed) => {
    confirmation?.resolve(confirmed);
    setConfirmation(null);
  };

  const columns = useMemo(
    () =>
      createHteTableColumns({
        canEdit: permissions.canEdit,
        supervisorMap,
      }),
    [permissions.canEdit, supervisorMap],
  );

  const selectedRowCount = Object.keys(rowSelection).length;

  const table = useMaterialReactTable({
    columns,
    data: htes,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableRowSelection: permissions.canSelectRows,
    enableHiding: false,
    enableClickToCopy: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableDensityToggle: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableEditing: permissions.canEdit,
    editDisplayMode: "row",
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
        "mrt-row-actions": selectedRowCount === 0,
      },
    },
    onRowSelectionChange: setRowSelection,
    onEditingRowSave: permissions.canEdit
      ? async ({ exitEditingMode, row, values }) => {
          const statusChanged =
            String(values.is_active) !== String(row.original.is_active);

          if (!statusChanged) {
            exitEditingMode();
            return;
          }

          if (!(await askForConfirmation("Are you sure you want to save these changes?"))) {
            return;
          }

          try {
            setPendingAction(`row-${row.original.id}`);
            if (statusChanged) {
              await onStatusChange({
                id: row.original.id,
                isActive: values.is_active === true || values.is_active === "true",
              });
            }
            exitEditingMode();
            notify.success("HTE updated successfully.");
          } catch (error) {
            console.error("Failed to update HTE:", error);
            notify.error(
              error.response?.data?.message || "Failed to update HTE.",
            );
          } finally {
            setPendingAction(null);
          }
        }
      : undefined,
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        if (
          event.target.closest("button") ||
          event.target.closest("input") ||
          event.target.closest('[role="checkbox"]')
        ) {
          return;
        }

        onHteClick?.(row.original);
      },
      sx: {
        cursor: onHteClick ? "pointer" : "default",
      },
    }),
    renderBottomToolbarCustomActions: ({ table: currentTable }) =>
      permissions.canBulkEdit ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              if (!(await askForConfirmation("Are you sure you want to activate the selected HTEs?"))) {
                return;
              }

              const ids = currentTable
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);

              setPendingAction("bulk-activate");
              try {
                await onBulkStatusChange({ ids, isActive: true });
                notify.success("HTEs activated successfully.");
              } catch (error) {
                console.error("Failed to activate HTE:", error);
                notify.error(
                  error.response?.data?.message || "Failed to activate HTE.",
                );
              } finally {
                setPendingAction(null);
              }
            }}
            startIcon={pendingAction === "bulk-activate" ? <CircularProgress size={16} /> : null}
          >
            {pendingAction === "bulk-activate" ? "Activating..." : "Activate"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!currentTable.getSelectedRowModel().rows.length}
            onClick={async () => {
              if (!(await askForConfirmation("Are you sure you want to deactivate the selected HTEs?"))) {
                return;
              }

              const ids = currentTable
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);

              setPendingAction("bulk-deactivate");
              try {
                await onBulkStatusChange({ ids, isActive: false });
                notify.success("HTEs deactivated successfully.");
              } catch (error) {
                console.error("Failed to deactivate HTEs:", error);
                notify.error(
                  error.response?.data?.message || "Failed to deactivate HTEs.",
                );
              } finally {
                setPendingAction(null);
              }
            }}
            startIcon={pendingAction === "bulk-deactivate" ? <CircularProgress size={16} /> : null}
          >
            {pendingAction === "bulk-deactivate" ? "Deactivating..." : "Deactivate"}
          </Button>
        </Box>
      ) : null,
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
