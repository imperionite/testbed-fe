import { useState } from 'react';
import { useTableState } from '../../shared/hooks/useTableState';

/**
 * Hook for managing the UI and interaction states of the Users table.
 * Handles row selection, action confirmation, and role selection states.
 * 
 * @param {Object} [initialState] - Optional initial state overrides
 */
export function useUserTableState(initialState = {}) {

  //Base table
  const baseTableState = useTableState(initialState);
  
  //User table specific states
  const [roleChooser, setRoleChooser] = useState({
    open: false,
    value: '',
  });

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
    ...baseTableState,

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