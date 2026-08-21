import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { studentApi } from "../api/students";
import useAuth from "../hooks/useAuth";
import StudentTable from "../components/StudentTable";

export default function StudentManagementPage() {
  const { user } = useAuth();
  
  const { data: students, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.listStudents,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading students.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Student Records</Typography>
        
        {(user?.role === 'administrator' || user?.role === 'internship_coordinator') && (
          <Button variant="contained" color="primary">
            Add Student
          </Button>
        )}
      </Box>

      <StudentTable data={students} />
    </Box>
  );
}
