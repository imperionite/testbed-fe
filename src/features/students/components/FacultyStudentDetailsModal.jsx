import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Grid,
} from '@mui/material'
import { formatDate, formatSentenceCase } from '../../shared/fieldFormatters'
import { BadgeStatus } from '../../internships/components/BadgeStatus'

const emptyValue = '–'

function Detail({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || emptyValue}</Typography>
    </Box>
  )
}

export default function FacultyStudentDetailsModal({ open, student, onClose }) {
  const currentInternship = student?.current_internship || student?.currentInternship || {}
  const hteProfile = currentInternship.hte_profiles || {}
  const firstName = student?.firstName || student?.first_name || ''
  const middleName = student?.middleName || student?.middle_name || ''
  const lastName = student?.lastName || student?.last_name || ''
  const name = [firstName, middleName, lastName].filter(Boolean).join(' ')

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Student Intern Details</DialogTitle>

      <DialogContent dividers>
        <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
          Student
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Detail label="Name" value={name || student?.student_number} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Student Number" value={student?.student_number} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Email" value={student?.profiles?.email || student?.email} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Program" value={student?.program} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Year" value={student?.year_level} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Section" value={student?.section} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Contact" value={student?.contact_number} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Detail label="Address" value={student?.address} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Emergency Contact" value={student?.emergency_contact_name} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Emergency Contact Phone" value={student?.emergency_contact_number} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mt: 1 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
          Internship
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="HTE Name" value={hteProfile.company_name} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="HTE Contact" value={hteProfile.contact_person} />
            <Typography variant="body2" color="text.secondary">
              {hteProfile.contact_email || ''}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Internship Status
              </Typography>
              {currentInternship.status ? (
                <Box sx={{ mt: 0.5 }}>
                  <BadgeStatus value={formatSentenceCase(currentInternship.status)} />
                </Box>
              ) : (
                emptyValue
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Required Hours" value={currentInternship.required_hours} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mt: 1 }} />
        <Grid container spacing={2} sx={{ mb: 0, mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Created At" value={formatDate(student?.created_at)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Updated At" value={formatDate(student?.updated_at)} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
