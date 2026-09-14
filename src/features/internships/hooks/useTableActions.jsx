import { useState, useCallback, useMemo } from 'react'
import notify from '../../../utils/toast'
import { formatSentenceCase } from '../form/fieldFormatters'

/**
 * Hook for managing internship table action handlers (inline editing & bulk status updates).
 *
 * @param {Object} params - Hook parameters
 * @param {Object} [params.permissions={}] - Permission flags (e.g., canEdit, canBulkEdit)
 * @param {Function} params.onFacultyAdviserChange - Async API handler for single faculty adviser updates
 * @param {Function} params.onStatusChange - Async API handler for single status updates
 * @param {Function} params.onBulkStatusChange - Async API handler for bulk status updates
 * @param {Function} [params.askForConfirmation] - Promise-based confirmation dialog trigger
 * @param {Function} [params.askForStatus] - Promise-based status selector modal trigger
 * @param {Function} [params.clearSelection] - Callback to reset active table row selection
 *
 * @returns {Object} Action handlers, loading state, and pending status flag
 */
export function useTableActions({
  permissions = {},
  onFacultyAdviserChange,
  onStatusChange,
  onBulkStatusChange,
  askForConfirmation,
  askForStatus,
  clearSelection,
}) {
  // Tracks active action ID ('bulk-status' or 'row-[id]')
  const [pendingAction, setPendingAction] = useState(null)

  // Evaluates to true whenever any async mutation is in progress
  const isPending = useMemo(() => pendingAction !== null, [pendingAction])

  /**
   * Action handler for inline table row editing.
   * Checks for modifications in faculty adviser or status, confirms with the user, and submits updates.
   */
  const handleInlineEdit = useCallback(
    async ({ exitEditingMode, row, values }) => {
      if (!row || !values) return

      const facultyAdviserChanged = values.facultyAdviserId !== row.original.facultyAdviserId
      const statusChanged = values.status !== row.original.status

      // Early return if no changes were made
      if (!facultyAdviserChanged && !statusChanged) {
        exitEditingMode()
        return
      }

      if (!permissions.canEdit) {
        notify.error('You do not have permission to edit internships.')
        return
      }

      const confirmed = askForConfirmation
        ? await askForConfirmation('Are you sure you want to save these changes?')
        : window.confirm('Are you sure you want to save these changes?')

      if (!confirmed) return

      setPendingAction(`row-${row.original.id}`)

      try {
        if (facultyAdviserChanged && onFacultyAdviserChange) {
          await onFacultyAdviserChange({
            id: row.original.id,
            facultyAdviserId: values.facultyAdviserId,
          })
        }

        if (statusChanged && onStatusChange) {
          await onStatusChange({
            id: row.original.id,
            status: values.status,
          })
        }

        exitEditingMode()
        notify.success('Internship updated successfully.')
      } catch (error) {
        notify.error(error?.message || 'Failed to update internship.')
      } finally {
        setPendingAction(null)
      }
    },
    [permissions.canEdit, onFacultyAdviserChange, onStatusChange, askForConfirmation],
  )

  /**
   * Action handler for bulk internship status updates.
   * Can be called with an explicit target status (e.g. handleBulkStatusChange(rows, 'active'))
   * or called without a status to prompt via `askForStatus`.
   *
   * @param {Array} selectedRows - Selected table row instances
   * @param {string} [targetStatus] - Target status value ('pending' | 'active' | 'completed')
   */
  const handleBulkStatusChange = useCallback(
    async (selectedRows, targetStatus) => {
      if (!selectedRows || selectedRows.length === 0) return

      const canBulk = permissions.canBulkEdit ?? permissions.canEdit
      if (!canBulk) {
        notify.error('You do not have permission to bulk edit internship status.')
        return
      }

      let nextStatus = targetStatus

      // Prompt for status if not supplied directly
      if (!nextStatus && askForStatus) {
        nextStatus = await askForStatus()
      }

      if (!nextStatus) return

      const formattedStatus = formatSentenceCase(nextStatus)

      const confirmed = askForConfirmation
        ? await askForConfirmation(
            `Are you sure you want to set the status of ${selectedRows.length} selected internship(s) to "${formattedStatus}"?`,
          )
        : window.confirm(
            `Are you sure you want to set the status of ${selectedRows.length} selected internship(s) to "${formattedStatus}"?`,
          )

      if (!confirmed) return

      setPendingAction('bulk-status')

      const ids = selectedRows.map((row) => row.original.id)

      try {
        if (onBulkStatusChange) {
          await onBulkStatusChange({ ids, status: nextStatus })
        }

        notify.success(
          `Successfully updated status to "${formattedStatus}" for ${selectedRows.length} record(s).`,
        )

        if (clearSelection) {
          clearSelection()
        }
      } catch (error) {
        notify.error(error?.message || 'Failed to bulk update internship statuses.')
      } finally {
        setPendingAction(null)
      }
    },
    [
      permissions.canBulkEdit,
      permissions.canEdit,
      askForStatus,
      askForConfirmation,
      onBulkStatusChange,
      clearSelection,
    ],
  )

  return {
    pendingAction,
    isPending,
    handleInlineEdit,
    handleBulkStatusChange,
  }
}

export default useTableActions
