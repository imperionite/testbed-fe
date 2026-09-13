import { useState, useCallback, useMemo } from "react";
import notify from "../../../utils/toast";
import { formatSentenceCase } from "../../shared/fieldFormatters";

/**
 * Hook for managing table action handlers (inline editing & bulk operations).
 * Separates API interaction and orchestration logic from presentation components.
 *
 * @param {Object} params - Hook parameters
 * @param {Object} params.permissions - Current user permission flags
 * @param {Function} params.onRoleChange - Async API handler for single user role updates
 * @param {Function} params.onStatusChange - Async API handler for single user status updates
 * @param {Function} params.onBulkRoleChange - Async API handler for multi-user role updates
 * @param {Function} params.onBulkStatusChange - Async API handler for multi-user status updates
 * @param {Function} params.askForConfirmation - Promise-based confirmation dialog trigger
 * @param {Function} params.askForRole - Promise-based role chooser dialog trigger
 * @param {Function} [params.clearSelection] - Callback to clear the active table selection state
 *
 * @returns {Object} Action handlers, loading states, and pending flags
 */
export function useTableActions({
  permissions = {},
  onRoleChange,
  onStatusChange,
  onBulkRoleChange,
  onBulkStatusChange,
  askForConfirmation,
  askForRole,
  clearSelection,
}) {
  // Tracks active action ('bulk-role', 'bulk-activate', 'bulk-deactivate', or 'row-[id]')
  const [pendingAction, setPendingAction] = useState(null);

  // Helper to determine if any async action is actively mutating
  const isPending = useMemo(() => pendingAction !== null, [pendingAction]);

  /**
   * Action handler for inline table row editing.
   * Compares edits against original row data, prompts for confirmation,
   * and runs necessary mutations sequentially.
   */
  const handleInlineEdit = useCallback(
    async ({ exitEditingMode, row, values }) => {
      if (!row || !values) return;

      // Detect changes
      const roleChanged = values.role !== row.original.role;

      const originalActive = row.original.isActive;
      const newActive = values.isActive;

      const statusChanged = newActive !== originalActive;

      // Early return if no actual changes were made
      if (!roleChanged && !statusChanged) {
        exitEditingMode();
        return;
      }

      // Double-check permissions
      if (!permissions.canEdit) {
        notify.error("You do not have permission to edit users.");
        return;
      }

      // Get user confirmation
      const confirmed = askForConfirmation
        ? await askForConfirmation(
            "Are you sure you want to save these changes?",
          )
        : window.confirm("Are you sure you want to save these changes?");

      if (!confirmed) return;

      setPendingAction(`row-${row.original.id}`);

      try {
        // Execute mutations sequentially
        if (roleChanged) {
          await onRoleChange({ id: row.original.id, role: values.role });
        }

        if (statusChanged) {
          await onStatusChange({ id: row.original.id, isActive: newActive });
        }

        exitEditingMode();
        notify.success("User updated successfully");
      } catch (error) {
        notify.error(error.message || "Failed to update user");
      } finally {
        setPendingAction(null);
      }
    },
    [permissions.canEdit, onRoleChange, onStatusChange, askForConfirmation],
  );

  /**
   * Action handler for bulk role changes.
   * Displays the role chooser dialog, requests confirmation, and applies edits.
   */
  const handleBulkRoleChange = useCallback(
    async (selectedRows) => {
      if (!selectedRows || selectedRows.length === 0) return;

      if (!permissions.canBulkEdit || !permissions.canChangeRole) {
        notify.error("You do not have permission to bulk edit roles.");
        return;
      }

      // 1. Get role selection from dialog
      if (!askForRole) {
        console.warn("useTableActions: askForRole is not provided.");
        return;
      }
      const selectedRole = await askForRole();
      if (!selectedRole) return; // User cancelled

      // 2. Confirm the action
      const formattedRole = formatSentenceCase(selectedRole);

      const confirmed = askForConfirmation
        ? await askForConfirmation(
            <>
              Are you sure you want to change the role of {selectedRows.length}{" "}
              selected user(s) to <b>{formattedRole}</b>?
            </>,
          )
        : window.confirm(
            `Are you sure you want to change the role of ${selectedRows.length} selected user(s) to "${formattedRole}"?`,
          );

      if (!confirmed) return;

      setPendingAction("bulk-role");

      // Extract user IDs
      const ids = selectedRows.map((row) => row.original.id);

      try {
        await onBulkRoleChange({ ids, role: selectedRole });
        notify.success(
          `Successfully updated role to ${selectedRole} for ${selectedRows.length} user(s).`,
        );

        if (clearSelection) {
          clearSelection();
        }
      } catch (error) {
        notify.error(error.message || "Failed to bulk update roles.");
      } finally {
        setPendingAction(null);
      }
    },
    [
      permissions.canBulkEdit,
      permissions.canChangeRole,
      askForRole,
      askForConfirmation,
      onBulkRoleChange,
      clearSelection,
    ],
  );

  /**
   * Action handler for bulk activation status updates.
   */
  const handleBulkActivate = useCallback(
    async (selectedRows) => {
      if (!selectedRows || selectedRows.length === 0) return;

      if (!permissions.canBulkEdit || !permissions.canChangeStatus) {
        notify.error("You do not have permission to bulk edit status.");
        return;
      }

      const confirmed = askForConfirmation
        ? await askForConfirmation(
            `Are you sure you want to activate ${selectedRows.length} selected user(s)?`,
          )
        : window.confirm(
            `Are you sure you want to activate ${selectedRows.length} selected user(s)?`,
          );

      if (!confirmed) return;

      setPendingAction("bulk-activate");

      const ids = selectedRows.map((row) => row.original.id);

      try {
        await onBulkStatusChange({ ids, isActive: true });
        notify.success(
          `Successfully activated ${selectedRows.length} user(s).`,
        );

        if (clearSelection) {
          clearSelection();
        }
      } catch (error) {
        notify.error(error.message || "Failed to bulk activate users.");
      } finally {
        setPendingAction(null);
      }
    },
    [
      permissions.canBulkEdit,
      permissions.canChangeStatus,
      askForConfirmation,
      onBulkStatusChange,
      clearSelection,
    ],
  );

  /**
   * Action handler for bulk deactivation status updates.
   */
  const handleBulkDeactivate = useCallback(
    async (selectedRows) => {
      if (!selectedRows || selectedRows.length === 0) return;

      if (!permissions.canBulkEdit || !permissions.canChangeStatus) {
        notify.error("You do not have permission to bulk edit status.");
        return;
      }

      const confirmed = askForConfirmation
        ? await askForConfirmation(
            `Are you sure you want to deactivate ${selectedRows.length} selected user(s)?`,
          )
        : window.confirm(
            `Are you sure you want to deactivate ${selectedRows.length} selected user(s)?`,
          );

      if (!confirmed) return;

      setPendingAction("bulk-deactivate");

      const ids = selectedRows.map((row) => row.original.id);

      try {
        await onBulkStatusChange({ ids, isActive: false });
        notify.success(
          `Successfully deactivated ${selectedRows.length} user(s).`,
        );

        if (clearSelection) {
          clearSelection();
        }
      } catch (error) {
        notify.error(error.message || "Failed to bulk deactivate users.");
      } finally {
        setPendingAction(null);
      }
    },
    [
      permissions.canBulkEdit,
      permissions.canChangeStatus,
      askForConfirmation,
      onBulkStatusChange,
      clearSelection,
    ],
  );

  return {
    pendingAction,
    isPending,
    handleInlineEdit,
    handleBulkRoleChange,
    handleBulkActivate,
    handleBulkDeactivate,
  };
}

export default useTableActions;
