import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { internshipApi } from "../api/internships";
import useAuth from "../hooks/useAuth";
import InternshipTable from "../components/InternshipTable";

export default function InternshipManagementPage() {
  const { user } = useAuth();
  
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
        
        {(user?.role === 'administrator' || user?.role === 'internship_coordinator') && (
          <Button variant="contained" color="primary">
            Add Internship
          </Button>
        )}
      </Box>

      <InternshipTable data={internships} />
    </Box>
  );
}
