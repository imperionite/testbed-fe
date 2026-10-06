import { Box, TextField, MenuItem, Button, Stack, CircularProgress } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getValidationSchema from '../validation/InternshipValidationSchema'

export default function InternshipStatusForm({ internship, mode, onSubmit, onCancel, isLoading }) {
  const currentStatus = internship?.status || 'pending'
  const isCompleted = currentStatus === 'completed'

  const today = new Date().toISOString().split('T')[0]
  const isFutureStartDate = internship?.start_date && internship.start_date > today

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { status: currentStatus },
  })

  const getDisabledStatus = (option) => {
    if (currentStatus === option) return true
    if (isCompleted) return true
    if (currentStatus === 'active' && option === 'pending') return true
    if (option === 'active' && isFutureStartDate) return true
    if (option === 'completed' && currentStatus !== 'active') return true
    return false
  }

  const onSubmitHandler = (data) => {
    onSubmit(data)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 2 }}>
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
                helperText={
                  errors.status?.message ||
                  (isFutureStartDate
                    ? `Active status is disabled due to the start date (${internship.start_date}) being in the future.`
                    : '')
                }
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
          <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          {!isCompleted && (
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {isLoading ? 'Saving...' : 'Update Status'}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
