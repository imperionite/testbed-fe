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
import { useNavigate } from "react-router-dom";

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

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordModal({ open }) {
  const navigate = useNavigate();
  const changePassword = useChangePassword();

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const togglePassword = (field) => {
    setShowPassword((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });

      notify.success("Password updated. Please sign in again.");

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      notify.error(
        error?.response?.data?.message ?? "Unable to change password.",
      );
    }
  };

  const renderPasswordField = (name, label, visibilityKey, autoComplete) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword[visibilityKey] ? "text" : "password"}
          autoComplete={autoComplete}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePassword(visibilityKey)}
                    edge="end"
                  >
                    {showPassword[visibilityKey] ? (
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
  );

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

          {renderPasswordField(
            "currentPassword",
            "Current Password",
            "current",
            "current-password",
          )}

          {renderPasswordField(
            "newPassword",
            "New Password",
            "new",
            "new-password",
          )}

          {renderPasswordField(
            "confirmPassword",
            "Confirm Password",
            "confirm",
            "new-password",
          )}

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
