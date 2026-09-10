import React from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/AttendanceValidationSchema";
import { MODES } from "../form/formConfig";

export default function AttendanceForm({ attendance, internshipId, mode, onSubmit, onCancel }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { 
        internship_id: internshipId || attendance?.internship_id || "",
        attendance_date: attendance?.attendance_date || "", 
        time_in: attendance?.time_in || "",
        time_out: attendance?.time_out || "",
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="attendance_date"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="date" label="Date" InputLabelProps={{ shrink: true }} error={!!errors.attendance_date} helperText={errors.attendance_date?.message} />
          )}
        />
        <Controller
          name="time_in"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="time" label="Time In" InputLabelProps={{ shrink: true }} error={!!errors.time_in} helperText={errors.time_in?.message} />
          )}
        />
        <Controller
          name="time_out"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="time" label="Time Out" InputLabelProps={{ shrink: true }} error={!!errors.time_out} helperText={errors.time_out?.message} />
          )}
        />
        <Stack direction="row" spacing={2}>
            <Button onClick={onCancel} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">{mode === MODES.CREATE ? "Submit" : "Update"}</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
