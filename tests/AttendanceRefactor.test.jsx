import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AttendanceFormModal from '../src/features/attendance/components/AttendanceFormModal'
import AttendanceTable from '../src/features/attendance/components/AttendanceTable'

describe('Attendance Refactor Components', () => {
  it('renders AttendanceFormModal with correct fields', () => {
    render(<AttendanceFormModal open={true} onClose={() => {}} onSubmit={() => {}} />)
    expect(screen.getByText(/Log New Attendance/i)).toBeTruthy()
    expect(screen.getAllByText(/Attendance Date/i)[0]).toBeTruthy()
    expect(screen.getAllByText(/Time In/i)[0]).toBeTruthy()
    expect(screen.getAllByText(/Time Out/i)[0]).toBeTruthy()
  })

  it('renders AttendanceTable with actions for students', () => {
    const data = [
      {
        id: '1',
        attendance_date: '2026-09-20',
        time_in: '08:00',
        time_out: '17:00',
        validation_status: 'pending',
      },
    ]
    const onEdit = vi.fn()
    render(<AttendanceTable data={data} isStudent={true} onEdit={onEdit} />)
    const editButton = screen.getByText(/Edit/i)
    expect(editButton).toBeTruthy()
    fireEvent.click(editButton)
    expect(onEdit).toHaveBeenCalledTimes(1)
  })
})
