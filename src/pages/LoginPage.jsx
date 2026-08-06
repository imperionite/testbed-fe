import { useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useLogin } from "../hooks/useAuth";
import notify from "../utils/toast";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const session = await login.mutateAsync(values);

      if (session.user.mustChangePassword) {
        notify.warning("You must change your password before continuing.");
      } else {
        notify.success("Welcome back!");
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      notify.error(error.response?.data?.message ?? "Unable to sign in.");
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
              SBIMS Portal
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
              Sign in to access the system
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

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="current-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                component={Link}
                to="/forgot-password"
                variant="text"
                size="small"
              >
                Forgot Password?
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={login.isPending}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
