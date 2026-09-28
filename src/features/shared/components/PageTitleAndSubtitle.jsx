import { Typography, Box } from '@mui/material'

export default function PageTitleAndSubtitle({ title, subtitle }) {
  return (
    <Box
      sx={{mb:1.5}}
    >
      <Typography variant="h5" component="h2">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" component="subtitle" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
