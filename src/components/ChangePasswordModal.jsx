import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useChangePassword } from "../hooks/useAuth";

import notify from "../utils/toast";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ["newPassword"],
    message: "New password must be different from the current password.",
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function ChangePasswordModal({ open }) {
  const changePassword = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      notify.success("Password updated successfully.");

      reset();
    } catch (error) {
      notify.error(
        error?.response?.data?.message ?? "Unable to change password.",
      );
    }
  };

  return (
    <Dialog open={open} disableRestoreFocus fullScreen onClose={() => {}}>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={3}
          sx={{
            width: 450,
            maxWidth: "100%",
          }}
        >
          <Typography variant="h4">Change Your Password</Typography>

          <Typography color="text.secondary">
            You are using a temporary password assigned by an administrator.
            Please create a new password before continuing.
          </Typography>

          <Controller
            name="currentPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showCurrentPassword ? "text" : "password"}
                label="Current Password"
                autoComplete="current-password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
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
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                autoComplete="new-password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                autoComplete="new-password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
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
            )}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            loading={changePassword.isPending}
          >
            Change Password
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
