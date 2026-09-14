import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import { MODES } from "../form/formConfig";
import AttendanceForm from "./AttendanceForm";
import AttendanceValidationForm from "./AttendanceValidationForm";

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

export default function AttendanceModal({ open, mode, attendance, internshipId, onClose, onSubmit }) {
  const getForm = () => {
    switch (mode) {
      case MODES.CREATE:
      case MODES.EDIT:
        return <AttendanceForm attendance={attendance} internshipId={internshipId} mode={mode} onSubmit={onSubmit} onCancel={onClose} />;
      case MODES.VALIDATE:
        return <AttendanceValidationForm attendance={attendance} mode={mode} onSubmit={onSubmit} onCancel={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">
            {mode === MODES.CREATE && "Add Attendance"}
            {mode === MODES.EDIT && "Edit Attendance"}
            {mode === MODES.VALIDATE && "Validate Attendance"}
        </Typography>
        {getForm()}
      </Box>
    </Modal>
  );
}
