import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import StudentForm from './StudentForm'

export default function StudentModal({
  open,
  mode,
  student,
  availableUsers,
  isStudent,
  onClose,
  onSubmit,
  isSaving = false,
  error = null,
}) {
  const handleFormSubmit = async (data) => {
    await onSubmit(data)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {mode === 'create' ? 'Add Student' : 'Edit Student'}
        <IconButton onClick={onClose} disabled={isSaving} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <StudentForm
          mode={mode}
          defaultValues={student || {}}
          availableUsers={availableUsers}
          isStudent={isStudent}
          onSubmit={handleFormSubmit}
          formId="student-form"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="student-form"
          variant="contained"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null} // 👈 Loading spinner
        >
          {isSaving ? 'Saving...' : mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
