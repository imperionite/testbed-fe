import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
} from '@mui/material'
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export default function AttendanceFormModal({ open, onClose, onSubmit, initialData = null }) {
  const [date, setDate] = useState(initialData ? dayjs(initialData.attendance_date) : dayjs())
  const [timeIn, setTimeIn] = useState(
    initialData ? dayjs(`2000-01-01T${initialData.time_in}`) : dayjs().hour(8).minute(0),
  )
  const [timeOut, setTimeOut] = useState(
    initialData
      ? initialData.time_out
        ? dayjs(`2000-01-01T${initialData.time_out}`)
        : dayjs().hour(17).minute(0)
      : dayjs().hour(17).minute(0),
  )

  const handleSubmit = () => {
    const payload = {
      attendance_date: date.format('YYYY-MM-DD'),
      time_in: timeIn.format('HH:mm'),
      time_out: timeOut ? timeOut.format('HH:mm') : null,
    }
    onSubmit(payload)
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>{initialData ? 'Update Attendance Record' : 'Log New Attendance'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
              1-hour lunch break is automatically deducted from the total hours worked.
            </Alert>
            <DatePicker
              label="Attendance Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <TimePicker
              label="Time In"
              value={timeIn}
              onChange={(newValue) => setTimeIn(newValue)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <TimePicker
              label="Time Out"
              value={timeOut}
              onChange={(newValue) => setTimeOut(newValue)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
