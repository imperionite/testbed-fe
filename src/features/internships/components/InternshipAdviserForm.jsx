import React from "react";
import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/InternshipValidationSchema";
import { useUsers } from "../../users/hooks/useUsers";
import { MODES } from "../form/formConfig";

export default function InternshipAdviserForm({ internship, mode, onSubmit, onCancel }) {
  const { data: users = [] } = useUsers();
  const facultyAdvisers = users.filter(u => u.role === 'faculty_adviser');
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { facultyAdviserId: internship?.faculty_adviser_id || "" },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="facultyAdviserId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Faculty Adviser" error={!!errors.facultyAdviserId} helperText={errors.facultyAdviserId?.message}>
              <MenuItem value="">None</MenuItem>
              {facultyAdvisers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                    {u.first_name} {u.last_name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Stack direction="row" spacing={2}>
            <Button onClick={onCancel} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">Assign Adviser</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
