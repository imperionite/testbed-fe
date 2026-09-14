import { useState, useMemo } from 'react';

/**
 * Hook for managing the UI and interaction states of the Users table.
 * Handles row selection, action confirmation, and status selection states.
 * 
 * @param {Object} [initialState] - Optional initial state overrides
 */
export function useTableState(initialState = {}) {
  // 1. Row Selection State
  const [rowSelection, setRowSelection] = useState(initialState.initialSelection || {});

  // 2. Confirmation Dialog State
  const [confirmation, setConfirmation] = useState(null);

  // 3. Status Chooser Dialog State
  const [statusChooser, setStatusChooser] = useState({
    open: false,
    value: '',
  });

  // 4. Derived Selection Values
  const selectedRowCount = useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]).length;
  }, [rowSelection]);

  const hasSelection = selectedRowCount > 0;

  // 5. Confirmation Dialog Helpers (Promise-based resolution)
  const askForConfirmation = (message) => {
    return new Promise((resolve) => {
      setConfirmation({
        message,
        resolve,
      });
    });
  };

  const closeConfirmation = (confirmed = false) => {
    if (confirmation?.resolve) {
      confirmation.resolve(confirmed);
    }
    setConfirmation(null);
  };

  // 6. Status Chooser Dialog Helpers (Promise-based resolution)
  const askForStatus = (defaultValue = '') => {
    return new Promise((resolve) => {
      setStatusChooser({
        open: true,
        value: defaultValue,
        resolve,
      });
    });
  };

  const setStatusChooserValue = (value) => {
    setStatusChooser((prev) => ({ ...prev, value }));
  };

  const closeStatusChooser = (selectedStatus = null) => {
    if (statusChooser?.resolve) {
      statusChooser.resolve(selectedStatus);
    }
    setStatusChooser({ open: false, value: '', resolve: null });
  };

  return {
    // Selection state & derived properties
    rowSelection,
    setRowSelection,
    selectedRowCount,
    hasSelection,

    // Confirmation state & helpers
    confirmation,
    askForConfirmation,
    closeConfirmation,

    // Status Chooser state & helpers
    statusChooser: {
      open: statusChooser.open,
      value: statusChooser.value,
      setValue: setStatusChooserValue,
    },
    askForStatus,
    closeStatusChooser,
  };
}