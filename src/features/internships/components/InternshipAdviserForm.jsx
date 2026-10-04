import { useEffect } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getValidationSchema from '../validation/InternshipValidationSchema'
import { useUsers } from '../../users/hooks/useUsers'
import { useUiPermissions } from '../../shared/hooks/useUiPermissions'
import { formatPersonName } from '../../shared/fieldFormatters'

export default function InternshipAdviserForm({
  internship,
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const { isAdminOrCoordinator: isAdminOrCoordinator } = useUiPermissions()
  const { data: users = [], isLoading: isUsersLoading } = useUsers({
    enabled: isAdminOrCoordinator,
  })
  const facultyAdvisers = users.filter((u) => u.role === 'faculty_adviser')

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { facultyAdviserId: internship?.faculty_adviser_id || '' },
  })

  const handleFormSubmit = (data) => {
    if (!isDirty) {
      onCancel()
      return
    }
    onSubmit(data)
  }

  useEffect(() => {
    reset({ facultyAdviserId: internship?.faculty_adviser_id || '' })
  }, [internship, reset])

  if (isUsersLoading) return <Box>Loading Faculty Advisers...</Box>

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="facultyAdviserId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Faculty Adviser"
              error={!!errors.facultyAdviserId}
              helperText={errors.facultyAdviserId?.message}
            >
              <MenuItem value="">None</MenuItem>
              {facultyAdvisers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {formatPersonName(u)}
                    <Typography variant="caption">{u.email}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? 'Saving...' : 'Assign Adviser'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
