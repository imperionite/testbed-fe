import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { INTERNSHIP_STATUSES } from "../form/InternshipValidationSchema";
import { formatSentenceCase } from "../form/fieldFormatters";

/**
 * Default fallback options for internship statuses
 */
const DEFAULT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

/**
 * @typedef {Object} StatusChooserDialogProps
 * @property {boolean} open - Whether the dialog is open
 * @property {string} value - Selected status value ('pending' | 'active' | 'completed')
 * @property {(status: string) => void} onChange - Handler for status selection change
 * @property {() => void} onConfirm - Handler for confirm action
 * @property {() => void} onCancel - Handler for cancel action
 * @property {boolean} [isLoading] - Whether the dialog is in a loading state
 * @property {Array<{value: string, label: string}>} [options] - Optional custom status options list
 */

/**
 * Status chooser dialog component for bulk internship status selection
 */
export function StatusChooserDialog({
  open,
  value = "",
  onChange,
  onConfirm,
  onCancel,
  isLoading = false,
  options,
}) {
  // Use custom options if provided, or build from schema array, or fall back to defaults
  const statusOptions =
    options ||
    INTERNSHIP_STATUSES?.map((status) => ({
      value: status,
      label: formatSentenceCase(status),
    })) ||
    DEFAULT_STATUS_OPTIONS;

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Choose Internship Status</DialogTitle>
      
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="bulk-status-label">Status</InputLabel>
          <Select
            labelId="bulk-status-label"
            value={value}
            label="Status"
            onChange={(event) => onChange(event.target.value)}
            disabled={isLoading}
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={!value || isLoading}
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StatusChooserDialog;