import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance";
import AttendanceTable from "../components/AttendanceTable";

export default function AttendanceManagementPage() {
  const { data: attendance, isLoading, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: attendanceApi.listAttendance,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading attendance records.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Attendance Records</Typography>
      </Box>

      <AttendanceTable data={attendance} />
    </Box>
  );
}
