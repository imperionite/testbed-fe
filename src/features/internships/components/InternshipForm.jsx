import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/InternshipValidationSchema";
import { useStudents } from "../../students/hooks/useStudents";
import { useHtes } from "../../htes/hooks/useHtes";
import { useInternshipMutations } from "../hooks/useInternshipMutations";
import { MODES } from "../form/formConfig";

export default function InternshipForm({ onClose }) {
  const { data: students = [] } = useStudents("administrator");
  const { data: htes = [] } = useHtes();
  
  const { createInternship } = useInternshipMutations();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(MODES.CREATE)),
    defaultValues: { studentId: "", hteId: "", requiredHours: 480 },
  });

  const onSubmit = (data) => {
    // Explicitly parse requiredHours to a number to match the backend contract
    const payload = {
      ...data,
      requiredHours: data.requiredHours ? Number(data.requiredHours) : undefined,
    };
    
    createInternship.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="studentId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Student" error={!!errors.studentId} helperText={errors.studentId?.message}>
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {/* Assuming based on backend schema, we need to map the student name here */}
                  {s.studentNumber || s.id}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
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
        <Button type="submit" variant="contained">Create Internship</Button>
      </Stack>
    </Box>
  );
}
