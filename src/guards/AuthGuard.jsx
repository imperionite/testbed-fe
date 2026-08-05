import { Box, CircularProgress } from "@mui/material";

import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function AuthGuard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
