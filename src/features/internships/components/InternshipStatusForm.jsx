import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getValidationSchema from '../validation/InternshipValidationSchema'

export default function InternshipStatusForm({ internship, mode, onSubmit, onCancel }) {
  const currentStatus = internship?.status || 'pending'
  const isCompleted = currentStatus === 'completed'

  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [pendingData, setPendingData] = useState(null)

  const [isWarningReady, setIsWarningReady] = useState(false)
  const [isConfirmationReady, setIsConfirmationReady] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { status: currentStatus },
  })

  // Timer for 3-second delay on Warning
  useEffect(() => {
    if (!warningDialogOpen) return
    const timer = setTimeout(() => setIsWarningReady(true), 3000)
    return () => clearTimeout(timer)
  }, [warningDialogOpen])

  // Timer for 2-second delay on Confirmation
  useEffect(() => {
    if (!confirmationDialogOpen) return
    const timer = setTimeout(() => setIsConfirmationReady(true), 2000)
    return () => clearTimeout(timer)
  }, [confirmationDialogOpen])

  const getDisabledStatus = (option) => {
    if (currentStatus === option) return true
    if (isCompleted) return true
    if (currentStatus === 'active' && option === 'pending') return true
    return false
  }

  const checkAndSubmit = (data) => {
    if (data.status === 'active' && new Date() < new Date(internship.start_date)) {
      // Include startDate update in pending data
      setPendingData({
        ...data,
        updateStartDate: new Date().toISOString().split('T')[0],
      })
      setIsWarningReady(false)
      setWarningDialogOpen(true)
    } else {
      onSubmit(data)
    }
  }

  const handleWarningConfirm = () => {
    if (!isWarningReady) return
    setWarningDialogOpen(false)
    setIsConfirmationReady(false)
    setConfirmationDialogOpen(true)
  }

  const handleFinalConfirm = () => {
    if (!isConfirmationReady) return
    setConfirmationDialogOpen(false)
    onSubmit(pendingData)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(checkAndSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        {isCompleted ? (
          <TextField
            label="Status"
            value={currentStatus.toUpperCase()}
            disabled
            fullWidth
            helperText="Completed internships cannot be updated."
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                color: 'rgba(0, 0, 0, 0.38)',
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.38)',
              },
              '& .MuiInputLabel-root.Mui-disabled': {
                color: 'rgba(0, 0, 0, 0.38)',
              },
              '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.12)',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          />
        ) : (
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Status"
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="pending" disabled={getDisabledStatus('pending')}>
                  Pending
                </MenuItem>
                <MenuItem value="active" disabled={getDisabledStatus('active')}>
                  Active
                </MenuItem>
                <MenuItem value="completed" disabled={getDisabledStatus('completed')}>
                  Completed
                </MenuItem>
              </TextField>
            )}
          />
        )}
        <Stack direction="row" spacing={2}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          {!isCompleted && (
            <Button type="submit" variant="contained">
              Update Status
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Warning Dialog - 3s delay */}
      <Dialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)}>
        <DialogTitle>Early Activation Warning</DialogTitle>
        <DialogContent>
          <Typography>
            You are trying to activate this internship before the original start date (
            {internship.start_date}). The start date will be changed to today (
            {new Date().toISOString().split('T')[0]}).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleWarningConfirm}
            variant="contained"
            color="warning"
            disabled={!isWarningReady}
          >
            {isWarningReady ? 'Proceed' : 'Please wait...'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Final Confirmation Dialog - 2s delay */}
      <Dialog open={confirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
        <DialogTitle>Final Confirmation</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone. Are you sure you want to proceed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleFinalConfirm}
            variant="contained"
            color="error"
            disabled={!isConfirmationReady}
          >
            {isConfirmationReady ? 'Confirm' : 'Please wait...'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
