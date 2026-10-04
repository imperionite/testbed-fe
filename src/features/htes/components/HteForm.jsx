import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Box,
  Typography,
} from '@mui/material'
import { hteFormConfig } from '../form/formConfig'
import { getHteFormPermissions, getVisibleHteFields } from '../htePermissions'
import getValidationSchema from '../form/HteValidationSchema'
import { formatAccountStatus, formatDate } from '../form/fieldFormatters'
import { formatPersonName } from '../../shared/fieldFormatters'

export default function HteForm({
  role,
  mode,
  defaultValues = {},
  onSubmit,
  onInvalid,
  formId = 'hte-form',
  supervisorOptions = [],
}) {
  const { getFieldRule } = getHteFormPermissions(role, mode)
  const schema = getValidationSchema(mode)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  })

  const handleSubmitData = (data) => {
    const payload = hteFormConfig.reduce((acc, field) => {
      if (getFieldRule(field) !== 'hidden' && data[field.name] !== undefined) {
        acc[field.name] = data[field.name]
      }
      return acc
    }, {})

    onSubmit?.(payload)
  }

  const visibleFields = getVisibleHteFields(role, mode)

  return (
    <Stack
      component="form"
      id={formId}
      noValidate
      onSubmit={handleSubmit(handleSubmitData, onInvalid)}
      spacing={2}
    >
      {visibleFields.map((field) => {
        const rule = getFieldRule(field)
        const isDisabled = rule === 'readonly'
        const isRequired = rule === 'required'

        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: rhfField }) => {
              if (field.type === 'supervisor-select') {
                if (isDisabled) {
                  const match = supervisorOptions.find((u) => u.id === rhfField.value)
                  const displayName = match
                    ? formatPersonName(match)
                    : (rhfField.value ?? 'No Supervisor')
                  return (
                    <TextField
                      value={displayName}
                      label={field.label}
                      disabled
                      fullWidth
                      size="small"
                    />
                  )
                }
                return (
                  <FormControl fullWidth size="small" error={!!errors[field.name]}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select {...rhfField} value={rhfField.value ?? ''} label={field.label}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {supervisorOptions.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {formatPersonName(u)}
                            <Typography variant="caption">{u.email}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              }

              if (field.type === 'select') {
                return (
                  <FormControl fullWidth size="small" error={!!errors[field.name]}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select {...rhfField} label={field.label} disabled={isDisabled}>
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              }

              if (field.type === 'status' && isDisabled) {
                return (
                  <Chip
                    label={formatAccountStatus(rhfField.value)}
                    color={rhfField.value === true ? 'success' : 'error'}
                    variant="filled"
                  />
                )
              }

              if (field.type === 'status') {
                return (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rhfField.value === true}
                        onChange={(event) => rhfField.onChange(event.target.checked)}
                        disabled={isDisabled}
                      />
                    }
                    label={formatAccountStatus(rhfField.value)}
                  />
                )
              }

              return (
                <TextField
                  {...rhfField}
                  value={
                    field.format === 'date' ? formatDate(rhfField.value) : (rhfField.value ?? '')
                  }
                  label={field.label}
                  type={field.type}
                  disabled={isDisabled}
                  required={isRequired}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  fullWidth
                  size="small"
                />
              )
            }}
          />
        )
      })}
    </Stack>
  )
}
