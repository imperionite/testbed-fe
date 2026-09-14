import { useState, useCallback } from 'react'

/**
 * Hook for managing the modal dialog lifecycle and state transitions.
 * Handles opening, closing, mode changes ('create', 'edit', 'view'), and managing
 * the active selected entity, aligning with Property 7 (Modal State Lifecycle).
 *
 * @param {Object} [initialState] - Optional initial state overrides
 * @returns {Object} Modal state variables and interactive setters
 */
export function useModalState(initialState = {}) {
  const [isOpen, setIsOpen] = useState(initialState.isOpen || false)
  const [mode, setModeState] = useState(initialState.mode || 'create') // 'create' | 'edit' | 'view'
  const [selectedEntity, setSelectedEntityState] = useState(initialState.selectedEntity || null)

  /**
   * Opens the modal dialog in a specific mode with an optional selected entity.
   *
   * @param {'create' | 'edit' | 'view'} targetMode - The mode to transition into
   * @param {Object|null} [entity=null] - The entity (e.g., user) in focus
   */
  const open = useCallback((targetMode, entity = null) => {
    setModeState(targetMode)
    setSelectedEntityState(entity)
    setIsOpen(true)
  }, [])

  /**
   * Closes the modal and completely resets the state to prevent leaking stale data
   * on subsequent opens, adhering to the modal state consistency contract (Property 7).
   */
  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedEntityState(null)
    setModeState('create')
  }, [])

  /**
   * Dynamically switches the modal's current mode (e.g., transitioning from 'view' to 'edit').
   *
   * @param {'create' | 'edit' | 'view'} newMode - The target mode to apply
   */
  const setMode = useCallback((newMode) => {
    setModeState(newMode)
  }, [])

  /**
   * Updates the active entity data in focus without changing the modal mode.
   *
   * @param {Object|null} entity - The updated entity details
   */
  const setSelectedEntity = useCallback((entity) => {
    setSelectedEntityState(entity)
  }, [])

  return {
    isOpen,
    mode,
    selectedEntity,
    open,
    close,
    setMode,
    setSelectedEntity,
  }
}

export default useModalState
