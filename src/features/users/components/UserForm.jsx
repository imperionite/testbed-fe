import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
} from "@mui/material";
import { userFormConfig } from "../form/formConfig";
import {
  getUserFormPermissions,
  getVisibleUserFields,
} from "../userPermissions";
import getValidationSchema from "../form/UserValidationSchema";
import { formatAccountStatus, formatUserDate } from "../form/fieldFormatters";

export default function UserForm({
  role,
  mode,
  defaultValues = {},
  onSubmit,
  formId = "user-form",
}) {
  const { getFieldRule } = getUserFormPermissions(role, mode);
  const schema = getValidationSchema(mode);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const handleSubmitData = (data) => {
    const payload = userFormConfig.reduce((acc, field) => {
      if (getFieldRule(field) !== "hidden" && data[field.name] !== undefined) {
        acc[field.name] = data[field.name];
      }
      return acc;
    }, {});

    onSubmit?.(payload);
  };

  const visibleFields = getVisibleUserFields(role, mode);

  return (
    <Stack
      component="form"
      id={formId}
      onSubmit={handleSubmit(handleSubmitData)}
      spacing={2}
    >
      {visibleFields.map((field) => {
        const rule = getFieldRule(field);
        const isDisabled = rule === "readonly";
        const isRequired = rule === "required";

        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: rhfField }) => (
              field.type === "select" ? (
                <FormControl fullWidth size="small" error={!!errors[field.name]}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    {...rhfField}
                    label={field.label}
                    disabled={isDisabled}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : field.type === "status" && isDisabled ? (
                <Chip
                  label={formatAccountStatus(rhfField.value)}
                  color={rhfField.value === true ? "success" : "error"}
                  variant="filled"
                />
              ) : field.type === "status" ? (
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
              ) : (
                <TextField
                  {...rhfField}
                  value={
                    field.format === "date"
                      ? formatUserDate(rhfField.value)
                      : rhfField.value ?? ""
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
            )}
          />
        );
      })}
    </Stack>
  );
}
