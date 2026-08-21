import { useState, useCallback } from 'react';

export const useUserModalState = () => {
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'create'
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((newMode, user = null) => {
    setMode(newMode);
    setSelectedUser(user);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedUser(null);
  }, []);

  return {
    isOpen,
    mode,
    selectedUser,
    open,
    close,
  };
};
