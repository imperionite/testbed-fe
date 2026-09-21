import { z } from 'zod'
import { MODES } from '../form/formConfig'

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createInternshipValidationSchema
  }
  if (mode === MODES.EDIT_STATUS) {
    return editStatusValidationSchema
  }
  return editInternshipValidationSchema
}

const createInternshipValidationSchema = z.object({
  studentId: z.string().uuid('Student is required'),
  hteId: z.string().uuid('HTE is required'),
  facultyAdviserId: z.string().uuid('Faculty Adviser is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  requiredHours: z.coerce
    .number()
    .int()
    .positive('Required hours must be a positive number'),
})

const editStatusValidationSchema = z.object({
  status: z.enum(['pending', 'active', 'completed']),
})

const editInternshipValidationSchema = z.object({
  hteId: z.string().uuid('HTE is required').optional(),
  facultyAdviserId: z.string().uuid('Faculty Adviser is required').optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  requiredHours: z.coerce
    .number()
    .int()
    .positive('Required hours must be a positive number')
    .optional()
    .nullable(),
})

export default getValidationSchema
