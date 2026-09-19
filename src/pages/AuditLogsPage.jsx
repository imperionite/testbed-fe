import { Box, Typography } from '@mui/material'
import { AuditTable, useAuditLogs } from '../features/audit'

export default function AuditLogsPage() {
  const { data: logsPage } = useAuditLogs()

  // Assuming the API returns an object with an 'items' array
  const logs = logsPage?.items || []

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        System Audit Logs
      </Typography>
      <AuditTable data={logs} />
    </Box>
  )
}
