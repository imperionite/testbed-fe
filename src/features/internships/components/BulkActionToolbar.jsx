import React from 'react'
import { Box, Button, CircularProgress } from '@mui/material'

/**
 * @typedef {Object} BulkAction
 * @property {string} key - Unique identifier for the action
 * @property {string} label - Display label for the action button
 * @property {() => Promise<void>} onClick - Action handler
 * @property {'contained' | 'outlined' | 'text'} [variant] - Button variant
 * @property {string} [color] - Button color
 * @property {boolean} [disabled] - Whether the button is disabled
 */

/**
 * @typedef {Object} BulkActionToolbarProps
 * @property {number} selectedCount - Number of selected rows
 * @property {BulkAction[]} actions - Array of bulk action configurations
 * @property {boolean} isPending - Whether any action is in progress
 * @property {string | null} pendingAction - Key of the action currently in progress
 */

/**
 * Generic bulk action toolbar component
 * Displays action buttons at all times.
 */
export function BulkActionToolbar({ selectedCount, actions, isPending, pendingAction }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {actions.map((action) => (
        <Button
          key={action.key}
          size="small"
          variant={action.variant || 'outlined'}
          color={action.color || 'primary'}
          disabled={action.disabled || selectedCount === 0 || isPending}
          onClick={action.onClick}
          startIcon={
            pendingAction === action.key ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {pendingAction === action.key ? `${action.label}...` : action.label}
        </Button>
      ))}
    </Box>
  )
}

export default BulkActionToolbar
