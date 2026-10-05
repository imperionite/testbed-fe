import { Box, MenuItem, TextField, Button, Stack, CircularProgress } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getValidationSchema from '../validation/AttendanceValidationSchema'

export default function AttendanceValidationForm({
  attendance,
  mode,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { validation_status: attendance?.validation_status || 'validated' },
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="validation_status"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Status"
              disabled={isSubmitting}
              error={!!errors.validation_status}
              helperText={errors.validation_status?.message}
            >
              <MenuItem value="validated">Validated</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          )}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={onCancel} variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSubmitting ? 'Saving...' : 'Validate'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
