import { useState, useMemo } from 'react'

/**
 * Generalized hook for managing the UI and interaction states of a table.
 * Handles row selection and action confirmation states.
 *
 * @param {Object} [initialState] - Optional initial state overrides
 */
export function useTableState(initialState = {}) {
  const [rowSelection, setRowSelection] = useState(initialState.initialSelection || {})

  const [columnVisibility, setColumnVisibility] = useState(
    initialState.initialColumnVisibility || {},
  )

  const [confirmation, setConfirmation] = useState(null)

  const selectedRowCount = useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]).length
  }, [rowSelection])

  const hasSelection = selectedRowCount > 0

  const askForConfirmation = (message) => {
    return new Promise((resolve) => {
      setConfirmation({
        message,
        resolve,
      })
    })
  }

  const closeConfirmation = (confirmed = false) => {
    if (confirmation?.resolve) {
      confirmation.resolve(confirmed)
    }
    setConfirmation(null)
  }

  return {
    // Selection state & derived properties
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    selectedRowCount,
    hasSelection,

    // Confirmation state & helpers
    confirmation,
    askForConfirmation,
    closeConfirmation,
  }
}
