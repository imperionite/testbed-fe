import React from 'react'
import { Stack } from '@mui/material'
import FormField from './FormFieldRenderer'

export function DynamicForm({
  fields = [],
  getFieldRule,
  control,
  errors,
  formatters,
  mode,
  supervisorOptions = [],
  isSupervisorLoading = false,
  supervisorError = null,
}) {
  return (
    <Stack component="form" spacing={2.5} sx={{ mt: 1 }}>
      {fields.map((field) => {
        const rule = getFieldRule ? getFieldRule(field) : 'editable'

        return (
          <FormField
            key={field.name}
            field={field}
            control={control}
            error={errors?.[field.name]}
            isDisabled={rule === 'readonly' || mode === 'view'}
            isRequired={rule === 'required'}
            formatters={formatters}
            supervisorOptions={field.type === 'supervisor-select' ? supervisorOptions : undefined}
            isSupervisorLoading={isSupervisorLoading}
            supervisorError={supervisorError}
          />
        )
      })}
    </Stack>
  )
}

export default DynamicForm
