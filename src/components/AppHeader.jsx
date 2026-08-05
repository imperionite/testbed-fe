import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import notify from "../utils/toast";
import logo from "../assets/logo.webp";
import useAuth, { useLogout } from "../hooks/useAuth";
export default function AppHeader() {
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess() {
        notify.success("Signed out successfully.");
      },

      onError() {
        // Token may already be invalid.
        notify.success("Signed out.");
      },

      onSettled() {
        navigate("/", {
          replace: true,
        });
      },
    });
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="SBIMS"
            sx={{
              height: 50,
              width: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.firstName} {user?.lastName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
