import { z } from 'zod'
import { MODES } from '../form/formConfig'

export const getValidationSchema = (mode) => {
  switch (mode) {
    case MODES.CREATE:
      return createAttendanceSchema
    case MODES.EDIT:
      return updateAttendanceSchema
    case MODES.VALIDATE:
      return attendanceValidationSchema
    default:
      return z.object({})
  }
}

const createAttendanceSchema = z.object({
  internship_id: z.string().uuid('Internship is required'),
  attendance_date: z.string().date('Date is required'),
  time_in: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:mm)'),
  time_out: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:mm)'),
})

const updateAttendanceSchema = z
  .object({
    attendance_date: z.string().date().optional(),
    time_in: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:mm)')
      .optional(),
    time_out: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:mm)')
      .optional(),
  })
  .refine(
    (data) =>
      data.attendance_date !== undefined ||
      data.time_in !== undefined ||
      data.time_out !== undefined,
    { message: 'At least one attendance field must be provided.' },
  )

const attendanceValidationSchema = z.object({
  validation_status: z.enum(['validated', 'rejected']),
})

export default getValidationSchema
