import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CardStat from "../shared/components/CardStat";
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
import { mapStudentData } from "./utils/studentUtils";

export default function StudentManagementPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    refetch,
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
      const userRecord =
        userData?.find((u) => u.id === student.id) || student.user || {};
      
      return mapStudentData(student, userRecord);
    });
  }, [students, userData]);

  if (isAuthLoading || isStudentsLoading || isUsersLoading)
    return <CircularProgress />;
  if (!permissions.canView)
    return <Typography color="error">Access denied.</Typography>;
  if (isStudentsError)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Error Loading Students</Typography>
          {studentsError?.message || "An unexpected error occurred while fetching student records. Please contact your system administrator."}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="inherit" onClick={refetch}>Retry</Button>
          </Box>
        </Alert>
      </Box>
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
