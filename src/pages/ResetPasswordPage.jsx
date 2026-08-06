import { useEffect, useState } from "react";

import {
  Alert,
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

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

import { useCompletePasswordReset } from "../hooks/useAuth";

import notify from "../utils/toast";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const completePasswordReset = useCompletePasswordReset();

  const [sessionReady, setSessionReady] = useState(false);

  const [invalidLink, setInvalidLink] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  /**
   * Establish Supabase recovery session
   */
  useEffect(() => {
    async function initializeRecovery() {
      try {
        const hash = window.location.hash.substring(1);

        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");

        const refreshToken = params.get("refresh_token");

        const type = params.get("type");

        if (!accessToken || !refreshToken || type !== "recovery") {
          setInvalidLink(true);
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,

          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        /**
         * Remove tokens from URL
         * after successful session creation
         */
        window.history.replaceState(null, "", window.location.pathname);

        setSessionReady(true);
      } catch (error) {
        console.error("Recovery session error:", error);

        setInvalidLink(true);
      }
    }

    initializeRecovery();
  }, []);

  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      newPassword: "",

      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      /**
       * Update password directly
       * through Supabase Auth
       */
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) {
        throw error;
      }

      /**
       * Retrieve current user
       * from recovery session
       */
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        throw new Error("Unable to identify user.");
      }

      /**
       * Notify backend that reset
       * is complete.
       *
       * Backend only updates:
       * must_change_password=false
       */
      await completePasswordReset.mutateAsync(data.user.id);

      notify.success("Password reset successfully.");

      setCompleted(true);

      await supabase.auth.signOut();
    } catch (error) {
      console.error("PASSWORD RESET ERROR:", error);

      notify.error(error?.message ?? "Unable to reset password.");
    }
  }

  if (invalidLink) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 6,
        }}
      >
        <Alert severity="error">Invalid or expired password reset link.</Alert>
      </Container>
    );
  }

  if (!sessionReady) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 6,
        }}
      >
        <Alert severity="info">Preparing password reset...</Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",

        justifyContent: "center",

        alignItems: "center",

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
          {!completed ? (
            <>
              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight={600}>
                  Reset Password
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  Create a new password for your account.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.5}>
                  <TextField
                    label="New Password"
                    type={showPassword.new ? "text" : "password"}
                    fullWidth
                    autoComplete="new-password"
                    {...register("newPassword")}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPassword((prev) => ({
                                  ...prev,

                                  new: !prev.new,
                                }))
                              }
                            >
                              {showPassword.new ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    type={showPassword.confirm ? "text" : "password"}
                    fullWidth
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPassword((prev) => ({
                                  ...prev,

                                  confirm: !prev.confirm,
                                }))
                              }
                            >
                              {showPassword.confirm ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={completePasswordReset.isPending}
                  >
                    Reset Password
                  </Button>
                </Stack>
              </Box>
            </>
          ) : (
            <>
              <Alert severity="success">Password reset successfully.</Alert>

              <Button variant="contained" onClick={() => navigate("/")}>
                Back to Sign In
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
