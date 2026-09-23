import { useState, useCallback } from 'react'

export const useEvaluationModalState = () => {
  const [mode, setMode] = useState('view') // 'view' | 'edit' | 'create'
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback((newMode, hte = null) => {
    setMode(newMode)
    setSelectedRecord(hte)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedRecord(null)
  }, [])

  return {
    isOpen,
    mode,
    selectedRecord,
    open,
    close,
  }
}
