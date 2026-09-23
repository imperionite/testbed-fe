import { Chip } from '@mui/material'

function BadgeStatus({ value }) {
  const normalizedValue = String(value || '').toLowerCase()

  return (
    <Chip
      label={value}
      size="small"
      color={normalizedValue === 'submitted' ? 'success' : 'default'}
      variant="filled"
    />
  )
}

export default BadgeStatus
