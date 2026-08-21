import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { hteApi } from "../api/htes";
import useAuth from "../hooks/useAuth";
import HTETable from "../components/HTETable";

export default function HTEManagementPage() {
  const { user } = useAuth();
  
  const { data: htes, isLoading, error } = useQuery({
    queryKey: ["htes"],
    queryFn: hteApi.listHtes,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading companies.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>HTE (Company) Records</Typography>
        
        {(user?.role === 'administrator' || user?.role === 'internship_coordinator') && (
          <Button variant="contained" color="primary">
            Add Company
          </Button>
        )}
      </Box>

      <HTETable data={htes} />
    </Box>
  );
}
