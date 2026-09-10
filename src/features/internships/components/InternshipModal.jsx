import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { MODES } from "../form/formConfig";
import InternshipStatusForm from "./InternshipStatusForm";
import InternshipAdviserForm from "./InternshipAdviserForm";
import InternshipDetailsForm from "./InternshipDetailsForm";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function InternshipModal({ open, mode, internship, onClose, onUpdateStatus, onAssignAdviser, onUpdateDetails }) {
  const isCompleted = internship?.status === 'completed';

  const getForm = () => {
    if (mode === MODES.EDIT_STATUS && isCompleted) {
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    This internship has already been marked as <strong>completed</strong> and cannot be updated further.
                </Typography>
                <Button onClick={onClose} variant="contained" fullWidth>
                    OK
                </Button>
            </Box>
        );
    }

    switch (mode) {
      case MODES.EDIT_STATUS:
        return <InternshipStatusForm internship={internship} mode={mode} onSubmit={onUpdateStatus} onCancel={onClose} />;
      case MODES.EDIT_ADVISER:
        return <InternshipAdviserForm internship={internship} mode={mode} onSubmit={onAssignAdviser} onCancel={onClose} />;
      case MODES.EDIT_DETAILS:
        return <InternshipDetailsForm internship={internship} mode={mode} onSubmit={onUpdateDetails} onCancel={onClose} />;
      default:
        return <Typography>Unsupported mode</Typography>;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">
            {mode === MODES.EDIT_STATUS && "Update Internship Status"}
            {mode === MODES.EDIT_ADVISER && "Assign Faculty Adviser"}
            {mode === MODES.EDIT_DETAILS && "Update Internship Details"}
        </Typography>
        {getForm()}
      </Box>
    </Modal>
  );
}
