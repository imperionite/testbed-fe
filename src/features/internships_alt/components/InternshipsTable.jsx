import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "@glebcha/material-react-table";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { internshipTableConfig } from "../config/tableConfig.js";
import { useTableState } from "../hooks/useTableState.js";
import { useTableActions } from "../hooks/useTableActions.jsx";
import { createInternshipTableColumns } from "./InternshipsTableColumns.jsx";
import BulkActionToolbar from "./shared/BulkActionToolbar.jsx";
import StatusChooserDialog from "./StatusChooserDialog.jsx";

export function InternshipsTable({
  internships = [],
  users = [],
  permissions = {},
  columns,
  onEditRow,
  onFacultyAdviserChange,
  onStatusChange,
  onBulkStatusChange,
}) {
  const tableState = useTableState();
  const defaultColumns = useMemo(
    () => createInternshipTableColumns({ canEdit: permissions.canEdit, users }),
    [permissions.canEdit, users],
  );
  const tableActions = useTableActions({
    permissions,
    onFacultyAdviserChange,
    onStatusChange,
    onBulkStatusChange,
    askForConfirmation: tableState.askForConfirmation,
    askForStatus: tableState.askForStatus,
    clearSelection: () => tableState.setRowSelection({}),
  });
  const table = useMaterialReactTable({
    ...internshipTableConfig,
    columns: columns ?? defaultColumns,
    data: internships,
    enableRowSelection: permissions.canSelectRows,
    enableEditing: permissions.canEdit,
    enableRowActions: permissions.canEdit,
    state: {
      rowSelection: tableState.rowSelection,
      columnVisibility: {
        "mrt-row-actions": tableState.selectedRowCount === 0,
      },
    },
    onRowSelectionChange: tableState.setRowSelection,
    onEditingRowSave: tableActions.handleInlineEdit,
    renderRowActions: ({ row, table: rowActionsTable }) => (
      <Tooltip title="Edit internship">
        <IconButton
          aria-label={`Edit internship ${row.original.id}`}
          onClick={(event) => {
            event.stopPropagation();
            rowActionsTable.setEditingRow(null);
            onEditRow?.(row.original);
          }}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
    icons: {
      SaveIcon: (props) =>
        tableActions.pendingAction?.startsWith("row-") ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <CheckIcon {...props} sx={{ ...props.sx, color: "success.main" }} />
        ),
    },
    renderBottomToolbarCustomActions: () => (
      <BulkActionToolbar
        selectedCount={tableState.selectedRowCount}
        actions={[
          {
            key: "bulk-status",
            label: "Change Status",
            variant: "contained",
            onClick: () =>
              tableActions.handleBulkStatusChange(
                table.getSelectedRowModel().rows,
              ),
          },
        ]}
        isPending={tableActions.isPending}
        pendingAction={tableActions.pendingAction}
      />
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Dialog
        open={Boolean(tableState.confirmation)}
        onClose={() => tableState.closeConfirmation(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>{tableState.confirmation?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => tableState.closeConfirmation(false)}>Cancel</Button>
          <Button
            onClick={() => tableState.closeConfirmation(true)}
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <StatusChooserDialog
        open={tableState.statusChooser.open}
        value={tableState.statusChooser.value}
        onChange={tableState.statusChooser.setValue}
        onConfirm={() => tableState.closeStatusChooser(tableState.statusChooser.value)}
        onCancel={() => tableState.closeStatusChooser(null)}
        isLoading={tableActions.pendingAction === "bulk-status"}
      />
    </>
  );
}

export default InternshipsTable;
