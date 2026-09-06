import React from "react";
import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getValidationSchema from "../validation/InternshipValidationSchema";
import { useStudents } from "../../students/hooks/useStudents";
import { useHtes } from "../../htes/hooks/useHtes";
import { useUsers } from "../../users/hooks/useUsers";
import { useInternshipMutations } from "../hooks/useInternshipMutations";
import { MODES } from "../form/formConfig";

export default function InternshipForm({ mode, internship, onClose }) {
  const { data: students = [], isLoading: isStudentsLoading, isError: isStudentsError } = useStudents("administrator");
  const { data: htes = [] } = useHtes();
  const { data: users = [] } = useUsers();
  const facultyAdvisers = users.filter(u => u.role === 'faculty_adviser');
  
  const { createInternship, updateInternship, updateStatus, assignAdviser } = useInternshipMutations();

  const isViewOrEdit = mode !== MODES.CREATE;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: { 
        studentId: students.some(s => s.id === internship?.student_id) ? internship?.student_id : "", 
        hteId: internship?.hte_id || "", 
        requiredHours: internship?.required_hours || 480,
        status: internship?.status || "pending",
        facultyAdviserId: internship?.faculty_adviser_id || ""
    },
  });

  const onSubmit = (data) => {
    if (mode === MODES.CREATE) {
        createInternship.mutate({
            studentId: data.studentId,
            hteId: data.hteId,
            requiredHours: data.requiredHours ? Number(data.requiredHours) : null
        }, { onSuccess: onClose });
    } else {
        const promises = [];
        
        if (data.status !== internship.status) {
            promises.push(updateStatus.mutateAsync({ 
                id: internship.id, 
                status: data.status 
            }));
        }
        
        if (data.facultyAdviserId !== (internship.faculty_adviser_id || "")) {
            promises.push(assignAdviser.mutateAsync({ 
                id: internship.id, 
                facultyAdviserId: data.facultyAdviserId === "" ? null : data.facultyAdviserId 
            }));
        }
        
        if (data.hteId !== internship.hte_id || Number(data.requiredHours) !== (internship.required_hours || 480)) {
            promises.push(updateInternship.mutateAsync({ 
                id: internship.id, 
                payload: {
                    hteId: data.hteId,
                    requiredHours: data.requiredHours ? Number(data.requiredHours) : null
                }
            }));
        }

        Promise.all(promises).then(onClose);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="studentId"
          control={control}
          render={({ field }) => (
            <TextField 
                {...field} 
                select 
                label={isStudentsLoading ? "Loading..." : isStudentsError ? "Error Loading Students" : "Student"} 
                disabled={isViewOrEdit || isStudentsLoading || isStudentsError} 
                error={!!errors.studentId || isStudentsError} 
                helperText={errors.studentId?.message || (isStudentsError ? "Unable to load students. Please refresh or contact admin." : "")}
            >
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
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Status" disabled={mode === MODES.VIEW} error={!!errors.status} helperText={errors.status?.message}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="facultyAdviserId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Faculty Adviser" disabled={mode === MODES.VIEW} error={!!errors.facultyAdviserId} helperText={errors.facultyAdviserId?.message}>
              <MenuItem value="">None</MenuItem>
              {facultyAdvisers.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.email}</MenuItem>
              ))}
            </TextField>
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
