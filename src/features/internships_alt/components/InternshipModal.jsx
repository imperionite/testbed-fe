import React, { useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InternshipForm from "./InternshipForm";
import { useUsers } from "../../users/hooks/useUsers";
import { useStudents } from "../../students/hooks/useStudents";
import { useHtes } from "../../htes/hooks/useHtes";
import { useInternships } from "../hooks/useInternshipMutations";
import { getValidationSchema } from "../form/InternshipValidationSchema";
import { MODES } from "../form/formConfig";

const getDefaultValues = (internship) => ({
  studentId: internship?.student_id || internship?.studentId || "",
  hteId: internship?.hte_id || internship?.hteId || "",
  requiredHours: internship?.required_hours ?? internship?.requiredHours ?? 480,
  facultyAdviserId:
    internship?.faculty_adviser_id || internship?.facultyAdviserId || "",
  status: internship?.status || "pending",
});

export function InternshipModal({
  open,
  mode,
  internship,
  permissions,
  onClose,
  onSuccess,
  onCreate,
  onUpdate,
  onFacultyAdviserChange,
  onStatusChange,
}) {
  // ----- DATA FETCHING -----
  const { data: htes = [], isLoading: isHtesLoading } = useHtes();
  const { data: students = [], isLoading: isStudentsLoading } = useStudents("administrator");
  const { data: users = [], isLoading: isUsersLoading } = useUsers();
  const { data: internships = [], isLoading: isInternshipsLoading } = useInternships();

  // ----- FILTERING LOGIC -----

  // 1. Filter faculty advisers from users array
  const facultyAdvisers = useMemo(() => {
    return users.filter((candidate) => candidate.role === "faculty_adviser");
  }, [users]);

  // 2. Filter available students (students without an internship)
  const availableStudents = useMemo(() => {
    // Create a set of student IDs that already have an assigned internship record
    const assignedStudentIds = new Set(
      internships
        .map((item) => item.student_id || item.studentId)
        .filter(Boolean)
    );

    const currentSelectedId = internship?.student_id || internship?.studentId;

    return students.filter((student) => {
      // Always retain the student currently attached to this internship when editing/viewing
      const isCurrentlySelected = student.id === currentSelectedId;
      
      // Student is unassigned if they lack a currentInternship object AND aren't in the internships list
      const hasNoCurrentInternship = !student.currentInternship;
      const isNotInInternshipsList = !assignedStudentIds.has(student.id);

      return isCurrentlySelected || (hasNoCurrentInternship && isNotInInternshipsList);
    });
  }, [students, internships, internship]);

  // -------------------------

  const isView = mode === MODES.VIEW;

  const form = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: getDefaultValues(internship),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(getDefaultValues(internship));
  }, [form, internship, mode]);

  // Map options for form controls
  const optionsByField = useMemo(
    () => ({
      studentId: availableStudents.length > 0
        ? availableStudents.map((student) => {
            // Extract names safely from nested profile or top-level properties
            const firstName =
              student.profiles?.first_name || student.firstName || "";
            const lastName =
              student.profiles?.last_name || student.lastName || "";
            const fullName = [firstName, lastName].filter(Boolean).join(" ");
            const studentNum = student.student_number || student.studentNumber || "";

            const label = fullName
              ? `${fullName}${studentNum ? ` (${studentNum})` : ""}`
              : studentNum || student.id;

            return {
              value: student.id,
              label,
            };
          })
        : [{ value: "", label: "No eligible students available" }],
      hteId: htes
        .filter((hte) => hte.is_active !== false)
        .map((hte) => ({ value: hte.id, label: hte.company_name })),
      facultyAdviserId: [
        { value: "", label: "None" },
        ...facultyAdvisers.map((adviser) => {
          const firstName =
            adviser.first_name || adviser.firstName || "";
          const lastName =
            adviser.last_name || adviser.lastName || "";
          const fullName = [firstName, lastName].filter(Boolean).join(" ");

          return {
            value: adviser.id,
            label: fullName || adviser.email,
          };
        }),
      ],
    }),
    [availableStudents, facultyAdvisers, htes]
  );

  const handleSubmit = async (values) => {
    try {
      if (mode === MODES.CREATE) {
        await onCreate({
          studentId: values.studentId,
          hteId: values.hteId,
          requiredHours: values.requiredHours
            ? Number(values.requiredHours)
            : null,
          facultyAdviserId: values.facultyAdviserId || null,
        });
        onSuccess?.("Internship created successfully.");
        return;
      }

      const original = getDefaultValues(internship);
      const updates = [];

      if (
        values.hteId !== original.hteId ||
        Number(values.requiredHours) !== Number(original.requiredHours)
      ) {
        updates.push(
          onUpdate({
            id: internship.id,
            payload: {
              hteId: values.hteId,
              requiredHours: values.requiredHours
                ? Number(values.requiredHours)
                : null,
            },
          })
        );
      }

      if (values.facultyAdviserId !== original.facultyAdviserId) {
        updates.push(
          onFacultyAdviserChange({
            id: internship.id,
            facultyAdviserId: values.facultyAdviserId || null,
          })
        );
      }

      if (values.status !== original.status) {
        updates.push(onStatusChange({ id: internship.id, status: values.status }));
      }

      await Promise.all(updates);
      onSuccess?.("Internship updated successfully.");
    } catch (error) {
      console.error("Error saving internship:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while saving the internship.";
      form.setError("root", { message: errorMessage });
    }
  };

  const isLoading =
    isStudentsLoading || isHtesLoading || isUsersLoading || isInternshipsLoading;
  const isSaving = form.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {mode === MODES.CREATE
          ? "Create Internship"
          : mode === MODES.VIEW
            ? "View Internship"
            : "Edit Internship"}
      </DialogTitle>
      <DialogContent dividers>
        {form.formState.errors.root?.message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {form.formState.errors.root.message}
          </Alert>
        )}
        <InternshipForm
          role={permissions.role}
          mode={mode}
          control={form.control}
          errors={form.formState.errors}
          optionsByField={optionsByField}
        />
        {isLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Loading form options...
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        {!isView && (
          <Button
            variant="contained"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSaving || isLoading || !permissions.canEdit}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default InternshipModal;