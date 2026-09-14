import { Badge } from '../../shared/components/Badge'

function BadgeRole({ value }) {
  return (
    <Badge
      value={value}
      variant="outlined"
      size="small"
      sx={{
        color: 'text.primary',
        borderColor: 'divider',
      }}
    />
  )
}

export default BadgeRole
