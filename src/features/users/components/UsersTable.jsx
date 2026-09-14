import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "@glebcha/material-react-table";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

import { userTableConfig } from "../config/tableConfig.js";
import { useUserTableState } from "../hooks/useUserTableState.js";
import { useTableActions } from "../hooks/useTableActions.jsx";
import { createUserTableColumns } from "../config/userTableColumns.jsx";

import BulkActionToolbar from "../../shared/components/BulkActionToolbar.jsx";
import RoleChooserDialog from "./RoleChooserDialog.jsx";
import ActionConfirmDialog from "../../shared/components/ActionConfirmDialog.jsx";
import { bulkActionsConfig } from "../config/bulkActionsConfig.js";

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
  const tableState = useUserTableState();
  const defaultColumns = useMemo(
    () => createUserTableColumns({ canEdit: permissions.canEdit }),
    [permissions.canEdit],
  );
  const tableColumns = columns ?? defaultColumns;

  // Table actions
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

  // Core table
  const table = useMaterialReactTable({
    ...userTableConfig,

    columns: tableColumns,
    data: users,

    // Permission-driven row interactions
    enableRowSelection: permissions.canSelectRows,
    enableEditing: permissions.canEdit,
    enableRowActions: permissions.canEdit,

    state: {
      rowSelection: tableState.rowSelection,
      columnVisibility: {
        ...tableState.columnVisibility,
        // Hide row actions while rows are selected so the bulk toolbar takes priority.
        "mrt-row-actions": tableState.selectedRowCount === 0,
      },
    },

    onRowSelectionChange: tableState.setRowSelection,
    onColumnVisibilityChange: tableState.setColumnVisibility,
    onEditingRowSave: tableActions.handleInlineEdit,

    // Open the external form from the row action icon.
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

    // Render the bulk actions toolbar
    renderBottomToolbarCustomActions: () => {
      const selectedRows = table.getSelectedRowModel().rows;

      const actionHandlers = {
        "change-role": () => tableActions.handleBulkRoleChange(selectedRows),
        activate: () => tableActions.handleBulkActivate(selectedRows),
        deactivate: () => tableActions.handleBulkDeactivate(selectedRows),
      };

      // integrate bulk actions config
      const availableActions = bulkActionsConfig
        .filter((action) => action.hasPermission(permissions))
        .map((action) => ({
          key: action.key,
          label: action.label,
          variant: action.key === "change-role" ? "contained" : "outlined",
          onClick: actionHandlers[action.key],
        }));

      return (
        <BulkActionToolbar
          selectedCount={tableState.selectedRowCount}
          actions={availableActions}
          isPending={tableActions.isPending}
          pendingAction={tableActions.pendingAction}
        />
      );
    },
  });

  return (
    <>
      {/* Main Grid Rendering */}
      <MaterialReactTable table={table} />

      {/* Generic Action Confirmation Dialog */}
      <ActionConfirmDialog
        open={Boolean(tableState.confirmation)}
        message={tableState.confirmation?.message}
        onConfirm={() => tableState.closeConfirmation(true)}
        onCancel={() => tableState.closeConfirmation(false)}
      ></ActionConfirmDialog>

      {/* Bulk Role Selection Chooser */}
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
