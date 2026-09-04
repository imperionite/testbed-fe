import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Stack, MenuItem } from "@mui/material";
import { StudentValidationSchema } from "../form/StudentValidationSchema";
import { MODES } from "../form/formConfig";

export default function StudentForm({ mode, defaultValues, onSubmit, onInvalid, isStudent, availableUsers }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(StudentValidationSchema),
    defaultValues: {
      userId: defaultValues.userId || defaultValues.user_id || defaultValues.user?.id || "",
      email: defaultValues.email || defaultValues.user?.email || "",
      firstName: defaultValues.firstName || defaultValues.first_name || defaultValues.user?.first_name || defaultValues.user?.firstName || "",
      middleName: defaultValues.middleName || defaultValues.middle_name || defaultValues.user?.middle_name || defaultValues.user?.middleName || "",
      lastName: defaultValues.lastName || defaultValues.last_name || defaultValues.user?.last_name || defaultValues.user?.lastName || "",
      studentNumber: defaultValues.studentNumber || defaultValues.student_number || "",
      program: defaultValues.program || "",
      yearLevel: defaultValues.yearLevel || defaultValues.year_level || 4,
      section: defaultValues.section || "",
      contactNumber: defaultValues.contactNumber || defaultValues.contact_number || "",
      address: defaultValues.address || "",
      emergencyContactName: defaultValues.emergencyContactName || defaultValues.emergency_contact_name || "",
      emergencyContactNumber: defaultValues.emergencyContactNumber || defaultValues.emergency_contact_number || "",
      internshipStatus: defaultValues.internshipStatus || defaultValues.internship_status || "pending",
    },
  });

  React.useEffect(() => {
    reset({
      userId: defaultValues.userId || defaultValues.user_id || defaultValues.user?.id || "",
      email: defaultValues.email || defaultValues.user?.email || "",
      firstName: defaultValues.firstName || defaultValues.first_name || defaultValues.user?.first_name || defaultValues.user?.firstName || "",
      middleName: defaultValues.middleName || defaultValues.middle_name || defaultValues.user?.middle_name || defaultValues.user?.middleName || "",
      lastName: defaultValues.lastName || defaultValues.last_name || defaultValues.user?.last_name || defaultValues.user?.lastName || "",
      studentNumber: defaultValues.studentNumber || defaultValues.student_number || "",
      program: defaultValues.program || "",
      yearLevel: defaultValues.yearLevel || defaultValues.year_level || 4,
      section: defaultValues.section || "",
      contactNumber: defaultValues.contactNumber || defaultValues.contact_number || "",
      address: defaultValues.address || "",
      emergencyContactName: defaultValues.emergencyContactName || defaultValues.emergency_contact_name || "",
      emergencyContactNumber: defaultValues.emergencyContactNumber || defaultValues.emergency_contact_number || "",
      internshipStatus: defaultValues.internshipStatus || defaultValues.internship_status || "pending",
    });
  }, [defaultValues, reset]);

  const isView = mode === MODES.VIEW;
  const isCreate = mode === MODES.CREATE;

  const handleFormSubmit = (data) => {
    const cleanedData = {
      ...data,
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      contactNumber: data.contactNumber || null,
      address: data.address || null,
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactNumber: data.emergencyContactNumber || null,
      yearLevel: Number(data.yearLevel),
    };
    
    // Remove the original camelCase fields to avoid sending duplicate/unnecessary data
    delete cleanedData.firstName;
    delete cleanedData.middleName;
    delete cleanedData.lastName;
    
    onSubmit(cleanedData);
  };

  return (
    <form id="student-form" onSubmit={handleSubmit(handleFormSubmit, onInvalid)}>
      <Stack spacing={2}>
        {isCreate ? (
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Select Student User"
                error={!!errors.userId}
                helperText={errors.userId?.message}
                disabled={isView || isStudent}
              >
                {availableUsers.length === 0 ? (
                <MenuItem disabled value="">
                  No available students
                </MenuItem>
                ) : (
                  availableUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />
        ) : (
            <TextField
                label="User ID"
                {...register("userId")}
                disabled={true} // ID cannot change in EDIT/VIEW
            />
        )}
        {!isCreate && (
          <>
            <TextField
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled
            />
            <TextField
              label="First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              disabled
            />
            <TextField
              label="Middle Name"
              {...register("middleName")}
              error={!!errors.middleName}
              helperText={errors.middleName?.message}
              disabled
            />
            <TextField
              label="Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              disabled
            />
          </>
        )}
        
        <TextField
          label="Student ID"
          {...register("studentNumber")}
          error={!!errors.studentNumber}
          helperText={errors.studentNumber?.message}
          disabled={isView || isStudent}
        />
        <TextField
          label="Program"
          {...register("program")}
          error={!!errors.program}
          helperText={errors.program?.message}
          disabled={isView || isStudent}
        />
        <TextField
          label="Year Level"
          type="number"
          {...register("yearLevel")}
          error={!!errors.yearLevel}
          helperText={errors.yearLevel?.message}
          disabled={isView || isStudent}
        />
        <TextField
          label="Section"
          {...register("section")}
          error={!!errors.section}
          helperText={errors.section?.message}
          disabled={isView || isStudent}
        />
        <TextField
          label="Contact Number"
          {...register("contactNumber")}
          error={!!errors.contactNumber}
          helperText={errors.contactNumber?.message}
          disabled={isView}
        />
        <TextField
          label="Address"
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message}
          disabled={isView}
        />
        <TextField
          label="Emergency Contact Name"
          {...register("emergencyContactName")}
          error={!!errors.emergencyContactName}
          helperText={errors.emergencyContactName?.message}
          disabled={isView}
        />
        <TextField
          label="Emergency Contact Number"
          {...register("emergencyContactNumber")}
          error={!!errors.emergencyContactNumber}
          helperText={errors.emergencyContactNumber?.message}
          disabled={isView}
        />
        <Controller
          name="internshipStatus"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Internship Status"
              error={!!errors.internshipStatus}
              helperText={errors.internshipStatus?.message}
              disabled={isView || isStudent}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          )}
        />
      </Stack>
    </form>
  );
}
