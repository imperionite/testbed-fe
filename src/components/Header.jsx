import { AppBar, Toolbar, Box } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";

export default function Header() {
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
      <Toolbar sx={{ minHeight: 72 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="SBIMS"
            sx={{
              height: 50,
              width: "auto"
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
