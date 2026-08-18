import { Box, Button, Paper, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { internshipApi } from "../api/internships";
import useAuth from "../hooks/useAuth";

export default function InternshipManagementPage() {
  const { user } = useAuth();
  
  // Fetch internships - the backend should handle the role-based filtering
  const { data: internships, isLoading, error } = useQuery({
    queryKey: ["internships"],
    queryFn: internshipApi.listInternships,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading internships.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Internship Records</Typography>
        
        {/* Conditional rendering for Admin/Coordinator only */}
        {(user?.role === 'administrator' || user?.role === 'internship_coordinator') && (
          <Button variant="contained" color="primary">
            Add Internship
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2 }}>
        {/* Data table/list would go here */}
        <pre>{JSON.stringify(internships, null, 2)}</pre>
      </Paper>
    </Box>
  );
}
