import { useState } from 'react'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
  ReportSummaryCards,
  ReportTable,
  useInternshipReport,
  useInternshipReportSummary,
} from '../features/reports'
import { useUiPermissions } from '../features/shared/hooks/useUiPermissions'

export default function ReportsPage() {
  const { data: summary } = useInternshipReportSummary()
  const { data: detailedReport = [] } = useInternshipReport()
  const { isReadOnlyStaff } = useUiPermissions()

  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState('PDF')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDownload = () => {
    if (format === 'CSV') {
      const flattenedData = detailedReport.map((row) => ({
        'Student Name': row.student?.name || 'N/A',
        'Student Number': row.student?.studentNumber || 'N/A',
        'Program': row.student?.program || 'N/A',
        'Company': row.hte?.companyName || 'N/A',
        'Status': row.status || 'N/A',
        'Rendered Hours': row.renderedHours || 0,
        'Remaining Hours': row.remainingHours || 0,
      }))
      const csv = Papa.unparse(flattenedData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'internship_report.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const doc = new jsPDF('landscape')
      doc.setFontSize(18)
      doc.text('Internship Report', 14, 20)

      const tableHead = [
        'Student Name',
        'Student Number',
        'Program',
        'Company',
        'Status',
        'Rendered Hours',
        'Remaining Hours',
      ]

      const tableData = detailedReport.map((row) => [
        row.student?.name || 'N/A',
        row.student?.studentNumber || 'N/A',
        row.student?.program || 'N/A',
        row.hte?.companyName || 'N/A',
        row.status || 'N/A',
        row.renderedHours || 0,
        row.remainingHours || 0,
      ])

      autoTable(doc, {
        startY: 30,
        head: [tableHead],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
        styles: { fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30, halign: 'right' },
          6: { cellWidth: 30, halign: 'right' },
        },
      })
      doc.save('internship_report.pdf')
    }
    handleClose()
  }


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          Internship Reports
        </Typography>
        {isReadOnlyStaff && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleOpen}
          >
            Download Report
          </Button>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Download Report</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              label="Format"
              onChange={(e) => setFormat(e.target.value)}
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="CSV">CSV</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDownload} variant="contained">
            Download
          </Button>
        </DialogActions>
      </Dialog>

      <ReportSummaryCards summary={summary} />
      <ReportTable data={detailedReport} />
    </Box>
  )
}
