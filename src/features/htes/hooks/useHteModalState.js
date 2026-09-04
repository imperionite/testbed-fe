import { useState, useCallback } from 'react';

export const useHteModalState = () => {
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'create'
  const [selectedHte, setSelectedHte] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((newMode, hte = null) => {
    setMode(newMode);
    setSelectedHte(hte);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedHte(null);
  }, []);

  return {
    isOpen,
    mode,
    selectedHte,
    open,
    close,
  };
};
