import { Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function NotFound() {
  const { user } = useAuth();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography variant="h1" fontWeight={700}>
          404
        </Typography>

        <Typography variant="h5">Page Not Found</Typography>

        <Typography color="text.secondary">
          The page you're looking for doesn't exist or may have been moved.
        </Typography>

        <Button component={RouterLink} to={user ? "/dashboard" : "/"} variant="contained" size="large">
          {user ? "Back to Dashboard" : "Back to Home"}
        </Button>
      </Stack>
    </Container>
  );
}
