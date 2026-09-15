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
} from '@mui/material'

import { ROLE_OPTIONS } from '../../shared/constants/constants'

/**
 * @typedef {Object} RoleChooserDialogProps
 * @property {boolean} open - Whether dialog is open
 * @property {string} value - Selected role value
 * @property {Function} onChange - Handler for role selection change
 * @property {Function} onConfirm - Handler for confirm action
 * @property {Function} onCancel - Handler for cancel action
 * @property {boolean} [isLoading] - Whether dialog is in loading state
 */

/**
 * Role chooser dialog component for bulk role selection
 */
export function RoleChooserDialog({
  open,
  value = '',
  onChange,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <Dialog open={open} onClose={isLoading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Choose a role</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="bulk-role-label">Role</InputLabel>
          <Select
            labelId="bulk-role-label"
            value={value}
            label="Role"
            onChange={(event) => onChange(event.target.value)}
            disabled={isLoading}
          >
            {ROLE_OPTIONS?.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            )) ||
              // Fallback options based on user validation schema if formConfig is not fully populated
              [
                { value: 'administrator', label: 'Administrator' },
                { value: 'internship_coordinator', label: 'Coordinator' },
                { value: 'faculty_adviser', label: 'Faculty Adviser' },
                { value: 'hte_supervisor', label: 'HTE Supervisor' },
                { value: 'student', label: 'Student' },
              ].map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={!value || isLoading}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoleChooserDialog
