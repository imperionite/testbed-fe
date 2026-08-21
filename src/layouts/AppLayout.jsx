import { Box } from "@mui/material";
import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import Footer from "../components/Footer";

import useAuth from "../hooks/useAuth";
import PasswordChangeGuard from "../guards/PasswordChangeGuard";

export default function AppLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          flexDirection: "row",
        }}
      >
        <Sidebar
          role={user?.role}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3 },
          }}
        >
          <PasswordChangeGuard>
            <Outlet />
          </PasswordChangeGuard>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
