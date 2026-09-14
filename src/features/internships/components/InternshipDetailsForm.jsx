import React from "react";
import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/InternshipValidationSchema";
import { useHtes } from "../../htes/hooks/useHtes";
import { MODES } from "../form/formConfig";

export default function InternshipDetailsForm({ internship, mode, onSubmit, onCancel }) {
  const { data: htes = [], isLoading } = useHtes();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { 
        hteId: internship?.hte_id || "", 
        requiredHours: internship?.required_hours || 480 
    },
  });

  if (isLoading) return <Box>Loading HTEs...</Box>;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="hteId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="HTE" error={!!errors.hteId} helperText={errors.hteId?.message}>
              {htes.map((h) => (
                <MenuItem key={h.id} value={h.id}>{h.company_name}</MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="requiredHours"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="number" label="Required Hours" error={!!errors.requiredHours} helperText={errors.requiredHours?.message} />
          )}
        />
        <Stack direction="row" spacing={2}>
            <Button onClick={onCancel} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">Update Details</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
