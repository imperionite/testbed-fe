import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography, Dialog, DialogTitle, DialogContent, MenuItem, TextField, DialogActions } from "@mui/material";
import { useAttendanceMutations } from "../features/attendance/hooks/useAttendanceMutations";
import { useAttendanceByInternship } from "../features/attendance/hooks/useAttendanceMutations";
import useAuth from "../hooks/useAuth";

const EARLY_OUT_REASONS = ["weather", "personal", "office", "school"];

export default function TimeTracker({ internshipId }) {
  const { user } = useAuth();
  const { data: attendanceRecords = [] } = useAttendanceByInternship(internshipId);
  const { createAttendance, updateAttendance } = useAttendanceMutations(internshipId);
  
  const today = new Date().toISOString().split("T")[0];
  const todaysRecord = attendanceRecords.find(r => r.attendance_date === today);

  const [rejectDialog, setRejectDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [justification, setJustification] = useState("");

  const handleTimeIn = () => {
    createAttendance.mutate({
      internship_id: internshipId,
      attendance_date: today,
      time_in: new Date().toISOString(),
      time_out: null
    });
  };

  const handleTimeOut = () => {
    // Check for early out
    const durationHours = (new Date() - new Date(todaysRecord.time_in)) / (1000 * 60 * 60);
    if (durationHours < 8) {
      setRejectDialog(true);
    } else {
      performTimeOut();
    }
  };

  const performTimeOut = (earlyOutReason = null, earlyOutNote = "") => {
    updateAttendance.mutate({
      id: todaysRecord.id,
      payload: {
        time_out: new Date().toISOString(),
        remarks: earlyOutReason ? `${earlyOutReason}: ${earlyOutNote}` : null
      }
    });
    setRejectDialog(false);
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: 20, top: 20 }}>
        <Button 
          variant="contained" 
          onClick={handleTimeIn} 
          disabled={!!todaysRecord}
        >
          Time In
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          disabled={!todaysRecord || todaysRecord.time_out}
        >
          Lunch
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleTimeOut}
          disabled={!todaysRecord || todaysRecord.time_out}
        >
          Time Out
        </Button>
      </Stack>

      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)}>
        <DialogTitle>Early Out Justification</DialogTitle>
        <DialogContent>
            <TextField select fullWidth label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mt: 1 }}>
                {EARLY_OUT_REASONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Justification" value={justification} onChange={(e) => setJustification(e.target.value)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setRejectDialog(false)}>Cancel</Button>
            <Button onClick={() => performTimeOut(reason, justification)} variant="contained" disabled={!reason}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
