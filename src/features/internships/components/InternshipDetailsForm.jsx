import { Box, TextField, MenuItem, Button, Stack, CircularProgress } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getValidationSchema from '../validation/InternshipValidationSchema'
import { useHtes } from '../../htes/hooks/useHtes'

export default function InternshipDetailsForm({
  internship,
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const { data: htes = [], isLoading: isHtesLoading } = useHtes()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: {
      hteId: internship?.hte_id || '',
      requiredHours: internship?.required_hours || 480,
    },
  })

  if (isHtesLoading) return <Box>Loading HTEs...</Box>

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="hteId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="HTE"
              error={!!errors.hteId}
              helperText={errors.hteId?.message}
            >
              {htes.map((h) => (
                <MenuItem key={h.id} value={h.id}>
                  {h.companyName ?? h.company_name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="requiredHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Required Hours"
              error={!!errors.requiredHours}
              helperText={errors.requiredHours?.message}
            />
          )}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? 'Saving...' : 'Update Details'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
