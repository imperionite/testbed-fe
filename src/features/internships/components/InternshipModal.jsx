import { Modal, Box, Typography, Button } from "@mui/material";
import InternshipForm from "./InternshipForm";

export default function InternshipModal({ open, mode, internship, onClose }) {
  return (
    <Modal onClose={onClose} open={open}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 4
      }}>
        <Typography variant="h6">
          {mode === 'create' ? 'Add New Intern' : mode === 'view' ? 'View Internship' : 'Edit Internship'}
        </Typography>
        <InternshipForm 
          mode={mode}
          internship={internship}
          onClose={onClose} 
        />
        <Button sx={{ mt: 2 }} onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
}
