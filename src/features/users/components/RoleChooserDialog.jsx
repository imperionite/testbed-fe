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
import { ROLES } from "../form/formConfig";

const roleOptions = [
  { value: ROLES.ADMIN, label: "Administrator" },
  { value: ROLES.INTERNSHIP_COORDINATOR, label: "Internship Coordinator" },
  { value: ROLES.FACULTY_ADVISER, label: "Faculty Adviser" },
  { value: ROLES.HTE_SUPERVISOR, label: "HTE Supervisor" },
  { value: ROLES.STUDENT, label: "Student" },
];

export default function RoleChooserDialog({
  open,
  value = "",
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
            {roleOptions.map((role) => (
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
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={!value || isLoading}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
