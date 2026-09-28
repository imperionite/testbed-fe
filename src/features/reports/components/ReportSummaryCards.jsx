import { Grid } from '@mui/material'
import CardStat from '../../shared/components/CardStat'
export default function ReportSummaryCards({ summary }) {
  if (!summary) return null

  const cards = [
    { label: 'Total Internships', value: summary.totalInternships },
    { label: 'Pending', value: summary.pending },
    { label: 'Active', value: summary.active },
    { label: 'Completed', value: summary.completed },
    { label: 'Total Required Hours', value: summary.totalRequiredHours },
    { label: 'Total Rendered Hours', value: summary.totalRenderedHours },
  ]

  return (
    <Grid container spacing={1} sx={{ width: '100%', mb:{xs:2.5, lg:3} }}>
      {cards.map((card, index) => (
        <Grid
          size={{
            xs: 6,
            md: 4,
            lg: 2.5,
          }}
          key={index}
        >
          <CardStat sx={{ height: '100%' }} title={card.label} value={card.value} />
        </Grid>
      ))}
    </Grid>
  )
}
