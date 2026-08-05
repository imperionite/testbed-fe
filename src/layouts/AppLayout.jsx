import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import Footer from "../components/Footer";

import useAuth from "../hooks/useAuth";
import PasswordChangeGuard from "../guards/PasswordChangeGuard";

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader />

      <Box
        sx={{
          flex: 1,
          display: "flex",
        }}
      >
        <Sidebar role={user?.role} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
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
