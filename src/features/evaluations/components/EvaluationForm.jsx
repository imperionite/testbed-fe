import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormControl,
  FormHelperText,
  Rating,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material'

import { EVALUATION_CRITERIA, getEvaluationTypeForRole } from '../form/evaluationConfig'
import { getValidationSchema } from '../form/EvaluationValidationSchema'

function buildDefaultValues(evaluation, role) {
  if (evaluation) {
    return {
      internship_id: evaluation.internship_id ?? '',
      evaluation_type: evaluation.evaluation_type ?? getEvaluationTypeForRole(role),
      responses: evaluation.responses ?? {},
      comments: evaluation.comments ?? '',
    }
  }

  return {
    internship_id: '',
    evaluation_type: getEvaluationTypeForRole(role),
    responses: {},
    comments: '',
  }
}

export default function EvaluationForm({
  role,
  mode,
  evaluation = null,
  internshipOptions = [],
  onSubmit,
  formId = 'evaluation-form',
}) {
  const isReadOnly = mode === 'view'
  const schema = getValidationSchema(mode)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(evaluation, role),
    mode: 'onBlur',
  })

  const submit = (data) => {
    const responses = Object.fromEntries(
      Object.entries(data.responses ?? {}).filter(([, score]) => Number(score) >= 1),
    )

    onSubmit?.({
      ...data,
      responses,
    })
  }

  return (
    <Stack component="form" id={formId} onSubmit={handleSubmit(submit)} spacing={2.5}>
      {mode === 'create' && (
        <Controller
          name="internship_id"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small" error={Boolean(errors.internship_id)}>
              <TextField
                {...field}
                select
                label="Internship"
                disabled={isReadOnly}
                value={field.value ?? ''}
              >
                <MenuItem value="">
                  <em>Select internship</em>
                </MenuItem>

                {internshipOptions.map((option) => (
                  <MenuItem key={option.internshipId} value={option.internshipId}>
                    {option.studentName}
                    {option.studentNumber ? ` — ${option.studentNumber}` : ''}
                  </MenuItem>
                ))}
              </TextField>

              <FormHelperText>{errors.internship_id?.message}</FormHelperText>
            </FormControl>
          )}
        />
      )}

      <Controller
        name="evaluation_type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Evaluation Type"
            fullWidth
            size="small"
            disabled
            value={field.value ?? ''}
          >
            <MenuItem value="hte_supervisor">HTE Supervisor</MenuItem>

            <MenuItem value="faculty_adviser">Faculty Adviser</MenuItem>
          </TextField>
        )}
      />

      <Stack spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          Evaluation Criteria
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Rate each applicable criterion from 1 to 5.
        </Typography>

        {EVALUATION_CRITERIA.map(({ key, label }) => (
          <Controller
            key={key}
            name={`responses.${key}`}
            control={control}
            render={({ field }) => (
              <Stack direction="row" alignitems="center" justifycontent="space-between" spacing={2}>
                <Typography variant="body2">{label}</Typography>

                <Rating
                  value={
                    field.value === undefined || field.value === null ? 0 : Number(field.value)
                  }
                  onChange={(_, value) => {
                    field.onChange(value || undefined)
                  }}
                  max={5}
                  disabled={isReadOnly}
                />
              </Stack>
            )}
          />
        ))}

        {errors.responses && (
          <Typography color="error" variant="body2">
            {errors.responses.message}
          </Typography>
        )}
      </Stack>

      <Controller
        name="comments"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Comments"
            multiline
            rows={4}
            fullWidth
            disabled={isReadOnly}
            error={Boolean(errors.comments)}
            helperText={errors.comments?.message}
          />
        )}
      />
    </Stack>
  )
}
