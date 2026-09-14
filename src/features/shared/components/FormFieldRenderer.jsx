import React from "react";
import { Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormLabel,
  Switch,
  // CircularProgress,
} from "@mui/material";

import {
  formatUserDate,
  formatAccountStatus,
} from "../fieldFormatters";

/**
 * Generic form field renderer
 *
 * This component dynamically renders different types of form fields based on the field configuration.
 * It supports various input types including text, email, password, select, date, datetime, status, and supervisor-select.
 *
 * @param {Object} props - Component props
 * @param {Object} props.field - Field configuration object containing:
 *   - name: Field name for React Hook Form
 *   - type: Input type (text, email, password, select, date, datetime, status, supervisor-select)
 *   - label: Display label for the field
 *   - options: For select fields, array of option objects with value and label
 *   - format: Optional formatting for display (e.g., "date")
 * @param {Object} props.control - React Hook Form control object
 * @param {Object} props.error - Field error object from React Hook Form
 * @param {boolean} props.isDisabled - Whether field is disabled
 * @param {boolean} props.isRequired - Whether field is required
 * @param {Array} props.supervisorOptions - Array of supervisor users for supervisor-select field type
 * @param {boolean} props.isSupervisorLoading - Loading state for supervisor data
 * @param {Object} props.supervisorError - Error state for supervisor data
 * @returns {React.ReactNode} Rendered field component
 */
export function FormField({ field, control, error, isDisabled, isRequired, supervisorOptions = [], isSupervisorLoading = false, supervisorError = null }) {
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhfField }) => {
        // Handle date formatting for display
        const displayValue =
          field.format === "date"
            ? formatUserDate(rhfField.value)
            : rhfField.value;

        // Supervisor select field type
        if (field.type === "supervisor-select") {
          if (isDisabled) {
            const match = supervisorOptions?.find((u) => u.id === rhfField.value);
            const displayName = match
              ? [match.last_name, match.first_name].filter(Boolean).join(", ")
              : rhfField.value ?? "No Supervisor";
            return (
              <TextField
                value={displayName}
                label={field.label}
                disabled
                fullWidth
                size="small"
              />
            );
          }
          
          if (isSupervisorLoading) {
            return (
              <FormControl fullWidth size="small" error={!!error}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...rhfField}
                  value={rhfField.value ?? ""}
                  label={field.label}
                  disabled={isDisabled}
                >
                  <MenuItem value="">
                    <em>Loading supervisors...</em>
                  </MenuItem>
                </Select>
              </FormControl>
            );
          }
          
          if (supervisorError) {
            return (
              <FormControl fullWidth size="small" error={!!error}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...rhfField}
                  value={rhfField.value ?? ""}
                  label={field.label}
                  disabled={isDisabled}
                >
                  <MenuItem value="">
                    <em>Error loading supervisors</em>
                  </MenuItem>
                </Select>
              </FormControl>
            );
          }

          return (
            <FormControl fullWidth size="small" error={!!error}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                {...rhfField}
                value={rhfField.value ?? ""}
                label={field.label}
                disabled={isDisabled}
                required={isRequired}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {supervisorOptions?.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {[u.last_name, u.first_name].filter(Boolean).join(", ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        switch (field.type) {
          case "select":
            return (
              <FormControl fullWidth size="small" error={!!error}>
                <InputLabel shrink>{field.label}</InputLabel>
                <Select
                  {...rhfField}
                  value={rhfField.value ?? ""}
                  label={field.label}
                  disabled={isDisabled}
                  required={isRequired}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );

          case "status_account":
            return (
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontSize: "0.75rem", mb: 0, ml: 0.9 }}
                >
                  {field.label || "Account Status"}
                </FormLabel>

                <FormControlLabel
                  sx={{ ml: -0.1 }}
                  control={
                    <Switch
                      checked={rhfField.value === true}
                      onChange={(event) =>
                        rhfField.onChange(event.target.checked)
                      }
                      disabled={isDisabled}
                    />
                  }
                  label={formatAccountStatus(rhfField.value)}
                />
              </FormControl>
            );

          case "email":
          case "text":
          case "password":
            return (
              <TextField
                {...rhfField}
                value={displayValue ?? ""}
                label={field.label}
                type={field.type}
                disabled={isDisabled}
                required={isRequired}
                error={!!error}
                helperText={error?.message}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            );

          case "date":
          case "datetime":
            return (
              <TextField
                {...rhfField}
                value={displayValue ?? ""}
                label={field.label}
                type="text"
                disabled={isDisabled}
                required={isRequired}
                error={!!error}
                helperText={error?.message}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            );

          default:
            return (
              <TextField
                {...rhfField}
                value={displayValue ?? ""}
                label={field.label}
                type="text"
                disabled={isDisabled}
                required={isRequired}
                error={!!error}
                helperText={error?.message}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            );
        }
      }}
    />
  );
}

export default FormField;
