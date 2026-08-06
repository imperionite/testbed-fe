import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForgotPassword } from "../hooks/useAuth";
import notify from "../utils/toast";

import { Link } from "react-router-dom";

const schema = z.object({
  email: z.email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await forgotPassword.mutateAsync(values.email);

      notify.success(response.message);
    } catch (error) {
      notify.error(
        error.response?.data?.message ??
          "Unable to process password reset request.",
      );
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 5,
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight={600}>
              Forgot Password
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
              Enter your email address and we will send you a password reset
              link.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                loading={forgotPassword.isPending}
              >
                Send Reset Link
              </Button>

              <Button component={Link} to="/" variant="text">
                Back to Sign In
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
