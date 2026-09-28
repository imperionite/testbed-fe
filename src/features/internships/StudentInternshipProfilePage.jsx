import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
} from '@mui/material'
import useAuth from '../../hooks/useAuth'
import { useInternshipMe } from './hooks/useInternshipsData'
import { useRenderedHours } from '../attendance/hooks/useAttendance'
import { formatSentenceCase } from '../shared/fieldFormatters'

export default function StudentInternshipProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth()

  const {
    data: internshipResponse,
    isLoading: isInternshipLoading,
    isError,
    error,
  } = useInternshipMe()

  // Handle 404 or missing internship gracefully
  const is404 = error?.response?.status === 404
  const internship =
    !is404 && !isError ? (internshipResponse?.data ?? internshipResponse ?? null) : null

  const internshipId = internship?.id
  const { data: renderedHoursData, isLoading: isRenderedLoading } = useRenderedHours(internshipId)

  // Handle loading state
  if (isAuthLoading || isInternshipLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Handle non-404 unexpected errors
  if (isError && !is404) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error?.message || 'Error loading internship profile.'}
      </Alert>
    )
  }

  const status = internship?.status || null

  // Safe field extractions for Internship / HTE Section
  const hteProfile = internship?.hte_profiles
  const companyName = hteProfile?.company_name || 'N/A'
  const contactPerson = hteProfile?.contact_person || 'N/A'
  const contactEmail = hteProfile?.contact_email || 'N/A'
  const startDate = internship?.start_date || 'N/A'
  const endDate = internship?.end_date || 'N/A'

  // Progress Hours Calculation
  const requiredHours = internship?.required_hours ?? 0
  const renderedHours =
    typeof renderedHoursData === 'number'
      ? renderedHoursData
      : (renderedHoursData?.totalHours ??
        renderedHoursData?.rendered_hours ??
        renderedHoursData?.renderedHours ??
        renderedHoursData?.data ??
        0)

  const progressPercent =
    requiredHours > 0 ? Math.min(Math.round((renderedHours / requiredHours) * 100), 100) : 0

  const profileName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Student Profile'
    : 'Student Profile'

  return (
    <Box>
      <Card sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              {profileName}
            </Typography>
          </Box>

          {/* Banner displayed when no internship is assigned */}
          {!internship && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No internship assigned
            </Alert>
          )}

          {/* Sections below are rendered only when an internship exists */}
          {internship && status && (
            <>
              <Divider sx={{ mb: 3 }} />

              {/* Progress Section */}
              <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                Internship Progress
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Internship Status
                  </Typography>
                  <Chip
                    label={formatSentenceCase(status)}
                    color={status === 'active' || status === 'approved' ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Required Hours
                  </Typography>
                  <Typography variant="body1">{requiredHours} hrs</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Rendered Hours
                  </Typography>
                  <Typography variant="body1">
                    {isRenderedLoading ? <CircularProgress size={16} /> : `${renderedHours} hrs`}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Progress ({renderedHours} / {requiredHours} hrs)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {progressPercent}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Internship Section */}
              <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                Internship Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Company Name
                  </Typography>
                  <Typography variant="body1">{companyName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">{contactPerson}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contact Email
                  </Typography>
                  <Typography variant="body1">{contactEmail}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">{startDate}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">{endDate}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
