import React from "react";
import { Box, MenuItem, TextField, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/AttendanceValidationSchema";
import { MODES } from "../form/formConfig";

export default function AttendanceValidationForm({ attendance, mode, onSubmit, onCancel }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { validation_status: attendance?.validation_status || "validated" },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="validation_status"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Status" error={!!errors.validation_status} helperText={errors.validation_status?.message}>
              <MenuItem value="validated">Validated</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          )}
        />
        <Stack direction="row" spacing={2}>
            <Button onClick={onCancel} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">Validate</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
