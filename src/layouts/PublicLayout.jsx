import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
