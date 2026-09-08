import React from "react";
import { Stack } from "@mui/material";
import FormField from "./shared/FormField";
import {
  getFieldRule,
  getVisibleInternshipFields,
} from "../internshipPermissions";

export function InternshipForm({
  role,
  mode,
  control,
  errors,
  optionsByField = {},
}) {
  const visibleFields = getVisibleInternshipFields(role, mode);

  return (
    <Stack spacing={2.5} sx={{ mt: 1 }}>
      {visibleFields.map((field) => {
        const rule = getFieldRule(field, role, mode);

        return (
          <FormField
            key={field.name}
            field={field}
            control={control}
            error={errors?.[field.name]}
            isDisabled={rule === "readonly" || mode === "view"}
            isRequired={rule === "required"}
            options={optionsByField[field.name]}
          />
        );
      })}
    </Stack>
  );
}

export default InternshipForm;
