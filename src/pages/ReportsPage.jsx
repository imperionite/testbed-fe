import { Box, Typography } from '@mui/material'
import {
  ReportSummaryCards,
  ReportTable,
  useInternshipReport,
  useInternshipReportSummary,
} from '../features/reports'

export default function ReportsPage() {
  const { data: summary } = useInternshipReportSummary()
  const { data: detailedReport = [] } = useInternshipReport()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Internship Reports
      </Typography>
      <ReportSummaryCards summary={summary} />
      <ReportTable data={detailedReport} />
    </Box>
  )
}
