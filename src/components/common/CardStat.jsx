import { Card, CardContent, Typography } from '@mui/material';

export default function CardStat({ title, value, sx = {} }) {
  return (
    <Card 
      sx={{
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      <CardContent sx={{ padding: '1.5rem' }}>
        <Typography 
          color="textSecondary" 
          variant="body2" 
          gutterBottom
          sx={{ 
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
