import React from "react";
import { Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { formatUserDate, formatAccountStatus } from "../../form/fieldFormatters";

/**
 * Generic form field renderer
 * @param {Object} props - Component props
 * @param {Object} props.field - Field configuration object
 * @param {Object} props.control - React Hook Form control object
 * @param {Object} props.error - Field error object
 * @param {boolean} props.isDisabled - Whether field is disabled
 * @param {boolean} props.isRequired - Whether field is required
 * @returns {React.ReactNode} Rendered field component
 */
export function FormField({ field, control, error, isDisabled, isRequired }) {
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

          case "status":
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
