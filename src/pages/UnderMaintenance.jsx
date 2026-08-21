import { Box, Typography } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

export default function UnderMaintenance() {
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "80vh" 
    }}>
      <BuildIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
      <Typography variant="h5" color="text.secondary">
        Page Under Construction
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This feature is currently being developed.
      </Typography>
    </Box>
  );
}
