import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  IconButton,
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
}) {
  const [error, setError] = useState(null)

  const handleFormSubmit = async (data) => {
    try {
      setError(null)
      await onSubmit(data)
    } catch (err) {
      setError(err.message || 'An error occurred while saving.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {mode === 'create' ? 'Add Student' : 'Edit Student'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <StudentForm
          mode={mode}
          defaultValues={student || {}}
          availableUsers={availableUsers}
          isStudent={isStudent}
          onSubmit={handleFormSubmit}
          onInvalid={() => setError('Please fix form errors.')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="student-form" variant="contained">
          {mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
