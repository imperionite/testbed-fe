import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  IconButton,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

/**
 * Reusable modal shell for viewing, creating, and editing entities.
 */
export function FormDialog({
  open,
  onClose,
  title,
  mode = 'create', // 'create' | 'edit' | 'view'
  isSaving = false,
  error = null,
  canEdit = false,
  onEdit,
  onSave,
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{title}</span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={isSaving}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, whiteSpace: 'pre-wrap' }}>
            {error}
          </Alert>
        )}
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSaving} color="inherit">
          {mode === 'view' ? 'Close' : 'Cancel'}
        </Button>

        {mode === 'view' && canEdit && (
          <Button onClick={onEdit} variant="contained" color="primary">
            Edit
          </Button>
        )}

        {mode !== 'view' && (
          <Button onClick={onSave} variant="contained" color="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog
