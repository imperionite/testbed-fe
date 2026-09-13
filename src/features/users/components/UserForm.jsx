import React from 'react';
import { Stack } from '@mui/material';
import FormField from './shared/FormField';
import { getVisibleUserFields, getUserFormPermissions } from '../userPermissions';
import { formatUserDate, formatAccountStatus } from '../form/fieldFormatters';

/**
 * @typedef {Object} UserFormProps
 * @property {string} role - Current user's role (admin, instructor, student)
 * @property {'view' | 'edit' | 'create'} mode - Form mode
 * @property {Object} control - React Hook Form control object
 * @property {Object} errors - Form field errors object from react-hook-form
 */

/**
 * UserForm component that dynamically renders user input fields based on
 * Role-Based Access Control (RBAC) visibility rules and form mode.
 * 
 * Fully integrated with react-hook-form and the FormField shared component.
 */
export function UserForm({ role, mode, control, errors }) {
  // 1. Get the list of fields that are visible for this role and mode
  const visibleFields = getVisibleUserFields(role, mode);
  
  // 2. Get permission helper to determine field-level editability rules
  const { getFieldRule } = getUserFormPermissions(role, mode);

  return (
    <Stack component="form" spacing={2.5} sx={{ mt: 1 }}>
      {visibleFields.map((field) => {
        const rule = getFieldRule(field);
        
        return (
          <FormField
            key={field.name}
            field={field}
            control={control}
            error={errors?.[field.name]}
            isDisabled={rule === 'readonly' || mode === 'view'}
            isRequired={rule === 'required'}
            formatters={{ 
              date: formatUserDate, 
              status: formatAccountStatus 
            }}
          />
        );
      })}
    </Stack>
  );
}

export default UserForm;
