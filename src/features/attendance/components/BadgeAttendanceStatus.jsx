import { Chip } from '@mui/material'

const STATUS_COLOR_MAP = {
  pending: 'warning',
  validated: 'success',
  rejected: 'error',
}

export function BadgeAttendanceStatus({ value }) {
  const normalizedStatus = value?.toLowerCase() || 'pending'

  const chipColor = STATUS_COLOR_MAP[normalizedStatus] || 'default'

  return <Chip label={value || 'Pending'} size="small" color={chipColor} variant="filled" />
}

export default BadgeAttendanceStatus
