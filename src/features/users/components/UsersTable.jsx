import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "@glebcha/material-react-table";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

// Import our configuration registries and custom hooks
import { userTableConfig } from "../config/tableConfig.js";
import { useTableState } from "../hooks/useTableState.js";
import { useTableActions } from "../hooks/useTableActions.jsx";
import { createUserTableColumns } from "./userTableColumns.jsx";

// Import decomposed components
import BulkActionToolbar from "./shared/BulkActionToolbar.jsx";
import RoleChooserDialog from "./RoleChooserDialog.jsx";

/**
 * @typedef {Object} UsersTableProps
 * @property {Array} users - Array of user objects to display
 * @property {Object} permissions - Current user's permissions
 * @property {Array} columns - Table column definitions
 * @property {Function} [onEditRow] - Handler for opening the external edit modal
 * @property {Function} onRoleChange - Async API handler for single user role updates
 * @property {Function} onStatusChange - Async API handler for single user status updates
 * @property {Function} onBulkRoleChange - Async API handler for multi-user role updates
 * @property {Function} onBulkStatusChange - Async API handler for multi-user status updates
 */

/**
 * UsersTable component that displays users with inline editing, row selection,
 * and bulk action toolbar capabilities.
 */
export function UsersTable({
  users = [],
  permissions = {},
  columns,
  onEditRow,
  onRoleChange,
  onStatusChange,
  onBulkRoleChange,
  onBulkStatusChange,
}) {
  // 1. Manage UI states (selection, confirmation, and roleChooser dialogs)
  const tableState = useTableState();
  const defaultColumns = useMemo(
    () => createUserTableColumns({ canEdit: permissions.canEdit }),
    [permissions.canEdit],
  );
  const tableColumns = columns ?? defaultColumns;

  // 2. Manage business actions and coordinate mutations
  const tableActions = useTableActions({
    permissions,
    onRoleChange,
    onStatusChange,
    onBulkRoleChange,
    onBulkStatusChange,
    askForConfirmation: tableState.askForConfirmation,
    askForRole: tableState.askForRole,
    clearSelection: () => tableState.setRowSelection({}),
  });

  // 3. Setup core table structure combining static config and runtime states
  const table = useMaterialReactTable({
    ...userTableConfig,

    columns: tableColumns,
    data: users,

    // Permission-driven row interactions
    enableRowSelection: permissions.canSelectRows,
    enableEditing: permissions.canEdit,
    enableRowActions: permissions.canEdit,

    // Runtime selection and column states
    state: {
      rowSelection: tableState.rowSelection,
      columnVisibility: {
        // Hide row actions if some rows are selected (prioritizing the Bulk Toolbar)
        "mrt-row-actions": tableState.selectedRowCount === 0,
      },
    },

    // Handlers wired cleanly to our custom hooks
    onRowSelectionChange: tableState.setRowSelection,
    onEditingRowSave: tableActions.handleInlineEdit,

    // Open the external form only from the row action icon.
    renderRowActions: ({ row, table: rowActionsTable }) => (
      <Tooltip title="Edit user">
        <IconButton
          aria-label={`Edit ${row.original.email}`}
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

    // Custom inline saving loader
    icons: {
      SaveIcon: (props) =>
        tableActions.pendingAction?.startsWith("row-") ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <CheckIcon {...props} sx={{ ...props.sx, color: "success.main" }} />
        ),
    },

    // Render the bulk actions toolbar at the bottom of the table
    renderBottomToolbarCustomActions: () => (
      <BulkActionToolbar
        selectedCount={tableState.selectedRowCount}
        actions={[
          {
            key: "change-role",
            label: "Change Role",
            variant: "contained",
            onClick: () =>
              tableActions.handleBulkRoleChange(
                table.getSelectedRowModel().rows
              ),
          },
          {
            key: "activate",
            label: "Activate",
            onClick: () =>
              tableActions.handleBulkActivate(table.getSelectedRowModel().rows),
          },
          {
            key: "deactivate",
            label: "Deactivate",
            onClick: () =>
              tableActions.handleBulkDeactivate(
                table.getSelectedRowModel().rows
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
      {/* 1. Main Grid Rendering */}
      <MaterialReactTable table={table} />

      {/* 2. Generic Action Confirmation Dialog */}
      <Dialog
        open={Boolean(tableState.confirmation)}
        onClose={() => tableState.closeConfirmation(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {tableState.confirmation?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => tableState.closeConfirmation(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => tableState.closeConfirmation(true)}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. Bulk Role Selection Chooser */}
      <RoleChooserDialog
        open={tableState.roleChooser?.open}
        value={tableState.roleChooser?.value}
        onChange={(value) => tableState.roleChooser.setValue(value)}
        onConfirm={() =>
          tableState.closeRoleChooser(tableState.roleChooser.value)
        }
        onCancel={() => tableState.closeRoleChooser(null)}
        isLoading={tableActions.pendingAction === "bulk-role"}
      />
    </>
  );
}

export default UsersTable;
