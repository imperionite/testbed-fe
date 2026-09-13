import { useState, useMemo } from 'react';

/**
 * Hook for managing the UI and interaction states of the Users table.
 * Handles row selection, action confirmation, and role selection states.
 * 
 * @param {Object} [initialState] - Optional initial state overrides
 */
export function useTableState(initialState = {}) {
  // 1. Row Selection State
  const [rowSelection, setRowSelection] = useState(initialState.initialSelection || {});

  // 2. Confirmation Dialog State
  const [confirmation, setConfirmation] = useState(null);

  // 3. Role Chooser Dialog State
  const [roleChooser, setRoleChooser] = useState({
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

  // 6. Role Chooser Dialog Helpers (Promise-based resolution)
  const askForRole = (defaultValue = '') => {
    return new Promise((resolve) => {
      setRoleChooser({
        open: true,
        value: defaultValue,
        resolve,
      });
    });
  };

  const setRoleChooserValue = (value) => {
    setRoleChooser((prev) => ({ ...prev, value }));
  };

  const closeRoleChooser = (selectedRole = null) => {
    if (roleChooser?.resolve) {
      roleChooser.resolve(selectedRole);
    }
    setRoleChooser({ open: false, value: '', resolve: null });
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

    // Role Chooser state & helpers
    roleChooser: {
      open: roleChooser.open,
      value: roleChooser.value,
      setValue: setRoleChooserValue,
    },
    askForRole,
    closeRoleChooser,
  };
}