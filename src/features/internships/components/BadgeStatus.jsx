import React from 'react'
import { Chip } from '@mui/material'

const STATUS_COLOR_MAP = {
  active: 'success',
  completed: 'default',
  pending: 'warning',
}

export function BadgeStatus({ value }) {
  const normalizedStatus = value?.toLowerCase() || ''

  const chipColor = STATUS_COLOR_MAP[normalizedStatus] || 'default'

  return <Chip label={value || 'N/A'} size="small" color={chipColor} variant="filled" />
}

export default BadgeStatus
