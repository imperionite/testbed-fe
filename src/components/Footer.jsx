import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        textAlign: "center",
        color: "text.secondary",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Link
          component={RouterLink}
          to="/privacy-policy"
          underline="hover"
          color="inherit"
          variant="caption"
        >
          Privacy Policy
        </Link>

        <Link
          component={RouterLink}
          to="/terms-and-conditions"
          underline="hover"
          color="inherit"
          variant="caption"
        >
          Terms & Conditions
        </Link>

        <Link
          component={RouterLink}
          to="/about"
          underline="hover"
          color="inherit"
          variant="caption"
        >
          About
        </Link>
      </Box>

      <Typography variant="body2">
        © {new Date().getFullYear()} SBIMS
      </Typography>

      <Typography variant="caption" display="block">
        Academic Project for Educational Purposes Only
      </Typography>
    </Box>
  );
}
