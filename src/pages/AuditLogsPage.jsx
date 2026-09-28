import { Box } from '@mui/material'
import { AuditTable, useAuditLogs } from '../features/audit'
import PageTitleAndSubtitle from '../features/shared/components/PageTitleAndSubtitle'

export default function AuditLogsPage() {
  const { data: logsPage } = useAuditLogs()

  // Assuming the API returns an object with an 'items' array
  const logs = logsPage?.items || []

  return (
    <Box>
      <PageTitleAndSubtitle title="System Audit Logs" subtitle="Review system activity and user actions." />
        <Box sx={{ width: '100%', mt:{xs:2.5, lg:3} }}>
        <AuditTable data={logs} />
      </Box>
    </Box>
  )
}
