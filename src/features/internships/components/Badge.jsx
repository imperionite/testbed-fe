import React from 'react'
import { Chip } from '@mui/material'

/**
 * @typedef {Object} BadgeProps
 * @property {string} value - Value to display in the badge
 * @property {Object.<string, string>} colorMap - Map of values to colors
 * @property {Object.<string, string>} [labelMap] - Optional map of values to display labels
 * @property {'filled' | 'outlined'} [variant] - Badge variant style
 */

/**
 * Generic badge component for displaying role and status chips
 */
export function Badge({ value, colorMap, labelMap, variant = 'filled' }) {
  if (value === undefined || value === null) {
    return <Chip label="-" variant={variant} color="default" />
  }

  const label = labelMap?.[value] ?? value
  const color = colorMap?.[value] ?? 'default'

  return <Chip label={label} variant={variant} color={color} />
}

export default Badge
