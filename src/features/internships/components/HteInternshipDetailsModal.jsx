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
import { formatUserDate, formatSentenceCase } from '../../shared/fieldFormatters'
import { BadgeStatus } from './BadgeStatus'

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

export default function HteInternshipDetailsModal({ open, student, onClose }) {
  const profile = student?.student_profiles || student?.studentProfiles || {}
  const person = profile.profiles || {}
  const firstName = person.first_name || person.firstName || ''
  const middleName = person.middle_name || person.middleName || ''
  const lastName = person.last_name || person.lastName || ''
  const suffix = person.suffix || ''
  const name = [firstName, middleName, lastName, suffix].filter(Boolean).join(' ')

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Internship Details</DialogTitle>

      <DialogContent dividers>
        <Typography variant="overline" component="h3" color="text.secondary">
          Internship
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Internship ID" value={student?.id} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Student ID" value={student?.student_id} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Required Hours" value={student?.required_hours} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Internship Status
              </Typography>
              {student?.status ? (
                <Box sx={{ mt: 0.5 }}>
                  <BadgeStatus value={formatSentenceCase(student.status)} />
                </Box>
              ) : (
                emptyValue
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mt: 2 }} />
        <Typography variant="overline" component="h3" color="text.secondary">
          Student
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Detail label="Name" value={name || student?.student_id} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Email" value={person.email} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Student Number" value={profile.student_number} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Contact Number" value={profile.contact_number} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Program" value={profile.program} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Section" value={profile.section} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Year Level" value={profile.year_level} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Detail label="Address" value={profile.address} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mt: 1 }} />
        <Typography variant="overline" component="h3" color="text.secondary">
          Emergency Contact
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Name" value={profile.emergency_contact_name} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Phone" value={profile.emergency_contact_number} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 0, mt: 1 }} />
        <Grid container spacing={2} sx={{ mb: 0, mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Created At" value={formatUserDate(profile.created_at)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Detail label="Updated At" value={formatUserDate(profile.updated_at)} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
