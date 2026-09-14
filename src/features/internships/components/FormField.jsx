import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export function FormField({
  field,
  control,
  error,
  isDisabled,
  isRequired,
  options = field.options || [],
}) {
  const hasOptions = options.length > 0 && options[0].value !== "";

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: controllerField }) => {
        if (field.type === "select") {
          return (
            <FormControl fullWidth size="small" error={Boolean(error)}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                {...controllerField}
                value={controllerField.value ?? ""}
                label={field.label}
                disabled={isDisabled || !hasOptions}
                required={isRequired}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
              {!hasOptions && (
                <FormHelperText>
                  {options[0]?.label || "No options available"}
                </FormHelperText>
              )}
            </FormControl>
          );
        }

        return (
          <TextField
            {...controllerField}
            value={controllerField.value ?? ""}
            label={field.label}
            type={field.type === "number" ? "number" : "text"}
            disabled={isDisabled}
            required={isRequired}
            error={Boolean(error)}
            helperText={error?.message}
            fullWidth
            size="small"
          />
        );
      }}
    />
  );
}

export default FormField;
