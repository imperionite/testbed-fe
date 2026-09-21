import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ReportSummaryCards from '../src/features/reports/components/ReportSummaryCards'
import ReportTable from '../src/features/reports/components/ReportTable'

describe('Reporting Module Components', () => {
  it('renders ReportSummaryCards', () => {
    const summary = {
      totalInternships: 10,
      pending: 2,
      active: 5,
      completed: 3,
      totalRequiredHours: 4800,
      totalRenderedHours: 2400,
    }
    render(<ReportSummaryCards summary={summary} />)
    expect(screen.getByText(/Total Internships/i)).toBeDefined()
    expect(screen.getByText(/10/i)).toBeDefined()
  })

  it('renders ReportTable', () => {
    const data = [
      {
        student: { name: 'Daniel Reyes', studentNumber: '123', program: 'CS' },
        hte: { companyName: 'Company A' },
        status: 'active',
        renderedHours: 100,
        remainingHours: 380,
      },
    ]
    render(<ReportTable data={data} />)
    expect(screen.getByText(/Daniel Reyes/i)).toBeDefined()
  })
})
