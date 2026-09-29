import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '../../hooks/useAuth'
import { useStudents } from './hooks/useStudents'
import { useStudentMutations } from './hooks/useStudentMutations'
import { StudentValidationSchema } from './form/StudentValidationSchema'
import { toSentenceCase } from './utils/formatters'

export default function StudentProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { data: student, isLoading, isError, error } = useStudents(user?.role)
  const { onUpdate } = useStudentMutations()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      StudentValidationSchema.pick({
        contactNumber: true,
        address: true,
        emergencyContactName: true,
        emergencyContactNumber: true,
      }),
    ),
    defaultValues: {
      contactNumber: student?.contact_number || '',
      address: student?.address || '',
      emergencyContactName: student?.emergency_contact_name || '',
      emergencyContactNumber: student?.emergency_contact_number || '',
    },
  })

  // Reset form when student data loads or isEditing toggles
  useEffect(() => {
    if (student) {
      reset({
        contactNumber: student.contact_number || '',
        address: student.address || '',
        emergencyContactName: student.emergency_contact_name || '',
        emergencyContactNumber: student.emergency_contact_number || '',
      })
    }
  }, [student, isEditing, reset])

  if (isAuthLoading || isLoading) return <CircularProgress />
  if (isError) {
    if (error?.response?.status === 404) {
      return <Typography>No profile found.</Typography>
    }
    return <Alert severity="error">{error?.message || 'Error loading profile.'}</Alert>
  }
  if (!student) return <Typography>No profile found.</Typography>

  const contactFields = [
    { label: 'Contact Number', name: 'contactNumber', value: student.contact_number },
    { label: 'Address', name: 'address', value: student.address },
    {
      label: 'Emergency Name',
      name: 'emergencyContactName',
      value: student.emergency_contact_name,
    },
    {
      label: 'Emergency Number',
      name: 'emergencyContactNumber',
      value: student.emergency_contact_number,
    },
  ]

  const onSubmit = async (data) => {
    try {
      const payload = {
        contactNumber: data.contactNumber,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
      }
      await onUpdate.mutateAsync({ id: student.id, payload, role: user.role })
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  const internshipStatus = student.currentInternship?.status

  return (
    <Box>
      <Card sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h5" fontWeight={600}>
              {student.profiles
                ? `${student.profiles.first_name || ''} ${student.profiles.last_name || ''}`.trim()
                : 'My Profile'}
            </Typography>
            {!isEditing ? (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <Box>
                <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  disabled={onUpdate.isPending}
                  startIcon={
                    onUpdate.isPending ? <CircularProgress size={18} color="inherit" /> : null
                  }
                >
                  {onUpdate.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Student ID
              </Typography>
              <Typography variant="body1">{student.student_number}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Program
              </Typography>
              <Typography variant="body1">{student.program}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Year Level
              </Typography>
              <Typography variant="body1">{student.year_level}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Internship Status
              </Typography>
              {!internshipStatus ? (
                <Typography variant="body2">No Internship</Typography>
              ) : (
                <Chip
                  label={toSentenceCase(internshipStatus)}
                  color={internshipStatus === 'active' ? 'success' : 'default'}
                />
              )}
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Stack spacing={2}>
            {contactFields.map((field) => (
              <Box key={field.name}>
                <Typography variant="subtitle2" color="textSecondary">
                  {field.label}
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    {...register(field.name)}
                    size="small"
                    margin="dense"
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                  />
                ) : (
                  <Typography variant="body1">{field.value || 'N/A'}</Typography>
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
