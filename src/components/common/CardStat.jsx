import { Card, CardContent, Typography } from '@mui/material';

export default function CardStat({ title, value, sx = {} }) {
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
