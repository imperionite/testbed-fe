import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/InternshipValidationSchema";
import { useStudents } from "../../students/hooks/useStudents";
import { useHtes } from "../../htes/hooks/useHtes";
import { useInternshipMutations } from "../hooks/useInternshipMutations";
import { MODES } from "../form/formConfig";

export default function InternshipForm({ mode, internship, onClose }) {
  const { data: students = [] } = useStudents("administrator");
  const { data: htes = [] } = useHtes();
  
  const { createInternship, updateInternship } = useInternshipMutations();

  const isViewOrEdit = mode !== MODES.CREATE;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { 
        studentId: internship?.student_id || "", 
        hteId: internship?.hte_id || "", 
        requiredHours: internship?.required_hours || 480 
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      requiredHours: data.requiredHours ? Number(data.requiredHours) : undefined,
    };
    
    if (mode === MODES.CREATE) {
        createInternship.mutate(payload, { onSuccess: onClose });
    } else {
        updateInternship.mutate({ id: internship.id, payload }, { onSuccess: onClose });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="studentId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Student" disabled={isViewOrEdit} error={!!errors.studentId} helperText={errors.studentId?.message}>
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.student_profiles?.student_number || s.id}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="hteId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="HTE" disabled={mode === MODES.VIEW} error={!!errors.hteId} helperText={errors.hteId?.message}>
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
            <TextField {...field} type="number" label="Required Hours" disabled={mode === MODES.VIEW} error={!!errors.requiredHours} helperText={errors.requiredHours?.message} />
          )}
        />
        {mode !== MODES.VIEW && (
            <Button type="submit" variant="contained">
                {mode === MODES.CREATE ? "Create Internship" : "Update Internship"}
            </Button>
        )}
      </Stack>
    </Box>
  );
}
