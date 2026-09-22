import { useEffect, useMemo } from 'react'
import { Box, TextField, MenuItem, Button, Stack } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import getValidationSchema from '../validation/InternshipValidationSchema'
import { useStudents } from '../../students/hooks/useStudents'
import { useHtes } from '../../htes/hooks/useHtes'
import { useUsers } from '../../users/hooks/useUsers'
import { useInternshipMutations } from '../hooks/useInternshipMutations'
import { MODES } from '../form/formConfig'

export default function InternshipForm({ mode, internships = [], internship, onClose, onSubmit }) {
  const {
    data: students = [],
    isLoading: isStudentsLoading,
    isError: isStudentsError,
  } = useStudents('administrator')
  const { data: htes = [] } = useHtes()
  const { data: users = [] } = useUsers()
  const facultyAdvisers = users.filter((u) => u.role === 'faculty_adviser')

  const { updateInternship, updateStatus, assignAdviser } =
    useInternshipMutations()

  const isViewOrEdit = mode !== MODES.CREATE

  const studentsWithInternships = useMemo(() => new Set(
    internships
      .filter((i) => i.status === 'active' || i.status === 'pending')
      .map((i) => i.student_id),
  ), [internships])

  const availableStudents = useMemo(() => {
    const studentsWithInternships = new Set(
      internships
        .filter((i) => i.status === 'active' || i.status === 'pending')
        .map((i) => i.student_id),
    )

    if (mode !== MODES.CREATE) return students
    return students.filter((s) => !studentsWithInternships.has(s.id))
  }, [students, internships, mode])

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(getValidationSchema(mode)),
    defaultValues: {
      studentId: students.some((s) => s.id === internship?.student_id)
        ? internship?.student_id
        : '',
      hteId: internship?.hte_id || '',
      requiredHours: internship?.required_hours || 480,
      status: internship?.status || 'pending',
      facultyAdviserId: internship?.faculty_adviser_id || '',
      startDate: internship?.start_date || '',
      endDate: internship?.end_date || '',
    },
  })

  // Watch fields to trigger auto-calculation
  const startDate = watch('startDate')
  const requiredHours = watch('requiredHours')

  useEffect(() => {
    if (startDate && requiredHours && mode === MODES.CREATE) {
      const start = new Date(startDate)
      // 8 hours per day, 25% buffer (1.25 factor)
      // Days needed = (hours / 8) * 1.25
      const daysNeeded = Math.ceil((Number(requiredHours) / 8) * 1.25)
      const end = new Date(start)
      end.setDate(end.getDate() + daysNeeded)
      
      setValue('endDate', end.toISOString().split('T')[0])
    }
  }, [startDate, requiredHours, mode, setValue])

  const onSubmitHandler = (data) => {
    if (mode === MODES.CREATE) {
      onSubmit({
        studentId: data.studentId,
        hteId: data.hteId,
        facultyAdviserId: data.facultyAdviserId,
        startDate: data.startDate,
        endDate: data.endDate,
        requiredHours: Number(data.requiredHours),
      })
    } else {
      const promises = []

      if (data.status !== internship.status) {
        promises.push(
          updateStatus.mutateAsync({
            id: internship.id,
            status: data.status,
          }),
        )
      }

      if (data.facultyAdviserId !== (internship.faculty_adviser_id || '')) {
        promises.push(
          assignAdviser.mutateAsync({
            id: internship.id,
            facultyAdviserId: data.facultyAdviserId === '' ? null : data.facultyAdviserId,
          }),
        )
      }

      if (
        data.hteId !== internship.hte_id ||
        Number(data.requiredHours) !== (internship.required_hours || 480) ||
        data.startDate !== internship.start_date ||
        data.endDate !== internship.end_date
      ) {
        promises.push(
          updateInternship.mutateAsync({
            id: internship.id,
            payload: {
              hteId: data.hteId,
              facultyAdviserId: data.facultyAdviserId,
              startDate: data.startDate,
              endDate: data.endDate,
              requiredHours: Number(data.requiredHours),
            },
          }),
        )
      }

      Promise.all(promises).then(onClose)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="studentId"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              select
              label={
                isStudentsLoading
                  ? 'Loading...'
                  : isStudentsError
                    ? 'Error Loading Students'
                    : mode === MODES.CREATE && availableStudents.length === 0
                      ? 'No Students Available'
                      : 'Student'
              }
              disabled={
                isViewOrEdit ||
                isStudentsLoading ||
                isStudentsError ||
                (mode === MODES.CREATE && availableStudents.length === 0)
              }
              error={!!errors.studentId || isStudentsError}
              helperText={
                errors.studentId?.message ||
                (isStudentsError ? 'Unable to load students. Please refresh or contact admin.' : '')
              }
            >
              {availableStudents.map((s) => {
                const userProfile = s.profiles || {}
                const firstName = userProfile.first_name || ''
                const lastName = userProfile.last_name || ''
                const fullName = [firstName, lastName].filter(Boolean).join(' ')
                const displayName = fullName.trim() || s.student_number || s.id

                return (
                  <MenuItem key={s.id} value={s.id}>
                    {displayName}
                  </MenuItem>
                )
              })}
            </TextField>
          )}
        />
        <Controller
          name="hteId"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              select
              label="HTE"
              disabled={mode === MODES.VIEW}
              error={!!errors.hteId}
              helperText={errors.hteId?.message}
            >
              {htes.map((h) => (
                <MenuItem key={h.id} value={h.id}>
                  {h.companyName ?? h.company_name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="facultyAdviserId"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              select
              label="Faculty Adviser"
              disabled={mode === MODES.VIEW}
              error={!!errors.facultyAdviserId}
              helperText={errors.facultyAdviserId?.message}
            >
              <MenuItem value="">None</MenuItem>
              {facultyAdvisers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.email}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="startDate"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              disabled={mode === MODES.VIEW}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              disabled={mode === MODES.VIEW}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />
          )}
        />
        <Controller
          name="requiredHours"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              type="number"
              label="Required Hours"
              disabled={mode === MODES.VIEW}
              error={!!errors.requiredHours}
              helperText={errors.requiredHours?.message}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              select
              label="Status"
              disabled={mode === MODES.VIEW}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          )}
        />
        {mode !== MODES.VIEW && (
          <Button type="submit" variant="contained">
            {mode === MODES.CREATE ? 'Create Internship' : 'Update Internship'}
          </Button>
        )}
      </Stack>
    </Box>
  )
}
