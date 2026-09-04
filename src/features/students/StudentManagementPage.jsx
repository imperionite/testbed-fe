import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardStat from "../../components/common/CardStat";
import StudentTable from "./components/StudentTable";
import StudentModal from "./components/StudentModal";
import useAuth from "../../hooks/useAuth";
import { useStudents } from "./hooks/useStudents";
import { useUsers } from "../users/hooks/useUsers";
import { useStudentMutations } from "./hooks/useStudentMutations";
import { useStudentModalState } from "./hooks/useStudentModalState";
import { getStudentManagementPermissions } from "./studentPermissions";
import { MODES } from "./form/formConfig";
import { useMemo } from "react";

export default function StudentManagementPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
  } = useStudents(user?.role);
  const { data: userData = [], isLoading: isUsersLoading } = useUsers();
  const modalState = useStudentModalState();
  const { onCreate, onUpdate } = useStudentMutations();

  const permissions = getStudentManagementPermissions(user?.role);

  // Merge student records with user metadata for names
  const mergedStudents = useMemo(() => {
    if (!students) return [];

    const studentsArr = Array.isArray(students) ? students : [students];

    return studentsArr.map((student) => {
      // Backend contract: student.id IS the user.id
      const studentUserId = student.id;
      const userRecord =
        userData?.find((u) => u.id === studentUserId) || student.user || {};
      const meta = userRecord.user_metadata || {};

      return {
        ...student,
        userId: studentUserId,
        email: student.email || userRecord.email || meta.email || "",
        firstName:
          student.firstName ||
          student.first_name ||
          userRecord.firstName ||
          userRecord.first_name ||
          meta.firstName ||
          meta.first_name ||
          "",
        middleName:
          student.middleName ||
          student.middle_name ||
          userRecord.middleName ||
          userRecord.middle_name ||
          meta.middleName ||
          meta.middle_name ||
          "",
        lastName:
          student.lastName ||
          student.last_name ||
          userRecord.lastName ||
          userRecord.last_name ||
          meta.lastName ||
          meta.last_name ||
          "",
      };
    });
  }, [students, userData]);

  if (isAuthLoading || isStudentsLoading || isUsersLoading)
    return <CircularProgress />;
  if (!permissions.canView)
    return <Typography color="error">Access denied.</Typography>;
  if (isStudentsError)
    return (
      <Alert severity="error">
        {studentsError?.message || "Error loading students."}
      </Alert>
    );

  return (
    <Box sx={{ minHeight: "100vh"}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Student Records
        </Typography>
        {permissions.canCreate && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => modalState.open(MODES.CREATE, null)}
          >
            Add Student
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        <CardStat title="Total Student Records" value={mergedStudents.length} />
        <CardStat
          title="Current Student Interns"
          value={
            mergedStudents.filter((s) => s.internship_status === "active")
              .length
          }
        />
      </Box>

      <StudentTable
        data={mergedStudents}
        role={user?.role}
        onEdit={(student) => modalState.open(MODES.EDIT, student)}
      />

      <StudentModal
        key={`${modalState.mode}-${modalState.selectedStudent?.id || "new"}-${modalState.isOpen}`}
        open={modalState.isOpen}
        mode={modalState.mode}
        student={modalState.selectedStudent}
        permissions={permissions}
        onClose={modalState.close}
        onCreate={onCreate.mutateAsync}
        onUpdate={onUpdate.mutateAsync}
        isStudent={false}
        availableUsers={userData.filter(
          (u) =>
            u.role === "student" &&
            !mergedStudents.some((s) => s.userId === u.id),
        )}
      />
    </Box>
  );
}
