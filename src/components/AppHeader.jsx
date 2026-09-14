import {
  Avatar,
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import notify from "../utils/toast";
import logo from "../assets/logo.webp";
import useAuth, { useLogout } from "../hooks/useAuth";
import { HeaderDropdownMenu } from "./AppHeaderDropdownMenu";

export default function AppHeader({ onMenuClick }) {
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
        paddingY: 0.5,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.accent",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 72 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          px: { xs: 1.5, sm: 3 },
        }}
      >
        {/* Menu Icon - Mobile Only */}
        <IconButton
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            p: 1,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="SBIMS"
            sx={{
              height: { xs: 32, sm: 50 },
              width: { xs: 32, sm: 50 },
              objectFit: "contain",
            }}
          />
        </Box>

        {/* User Info & Avatar - Right Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1.5 },
            minWidth: 0,
            ml: "auto",
          }}
        >
          {/* User Name & Role - Hide on XS */}
          <Box
            sx={{
              textAlign: "right",
              minWidth: 0,
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>

            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.role}
            </Typography>
          </Box>

          {/* Avatar */}
          <Avatar
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              fontSize: { xs: 12, sm: 14 },
              backgroundColor: "muted.contrastText",
              flexShrink: 0,
            }}
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Avatar>

          {/* Dropdown Menu */}
          <HeaderDropdownMenu
            onLogout={handleLogout}
            isLoading={logout.isPending}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
