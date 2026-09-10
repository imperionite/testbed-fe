import React from "react";
import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/InternshipValidationSchema";
import { MODES } from "../form/formConfig";

export default function InternshipStatusForm({ internship, mode, onSubmit, onCancel }) {
  const currentStatus = internship?.status || "pending";
  const isCompleted = currentStatus === "completed";
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { status: currentStatus },
  });

  const getDisabledStatus = (option) => {
    if (isCompleted) return true;
    if (currentStatus === "active" && option === "pending") return true;
    return false;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        {isCompleted ? (
            <TextField 
                label="Status" 
                value={currentStatus.toUpperCase()} 
                disabled 
                fullWidth
                helperText="Completed internships cannot be updated."
                sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                        color: "rgba(0, 0, 0, 0.38)",
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.38)",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                        color: "rgba(0, 0, 0, 0.38)",
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.12)",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                }}
            />
        ) : (
            <Controller
            name="status"
            control={control}
            render={({ field }) => (
                <TextField 
                    {...field}
                    select
                    label="Status" 
                    error={!!errors.status} 
                    helperText={errors.status?.message}
                >
                <MenuItem value="pending" disabled={getDisabledStatus("pending")}>Pending</MenuItem>
                <MenuItem value="active" disabled={getDisabledStatus("active")}>Active</MenuItem>
                <MenuItem value="completed" disabled={getDisabledStatus("completed")}>Completed</MenuItem>
                </TextField>
            )}
            />
        )}
        <Stack direction="row" spacing={2}>
            <Button onClick={onCancel} variant="outlined">Cancel</Button>
            {!isCompleted && <Button type="submit" variant="contained">Update Status</Button>}
        </Stack>
      </Stack>
    </Box>
  );
}
