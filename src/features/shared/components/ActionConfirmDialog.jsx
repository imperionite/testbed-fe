import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

// REUSABLE ACTION CONFIRM DIALOG
// Props it accepts:
// {
//   open: boolean,             // Whether dialog is visible
//   title: string,             // Dialog title (default: "Confirm action")
//   message: string,           // Main message text
//   confirmLabel: string,      // Text for confirm button (default: "Confirm")
//   cancelLabel: string,       // Text for cancel button (default: "Cancel")
//   onConfirm: function,       // Handler when user confirms
//   onCancel: function,        // Handler when user cancels
//   isLoading: boolean         // Loading state for buttons
// }

export default function ActionConfirmDialog({
  open,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
