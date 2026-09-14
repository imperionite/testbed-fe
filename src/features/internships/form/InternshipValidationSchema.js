import { z } from 'zod'
import { MODES } from '../form/formConfig'

// const requiredString = (fieldName, maxLength) =>
//   z.preprocess(
//     (value) => (value === undefined || value === null ? "" : value),
//     z
//       .string({
//         required_error: `${fieldName} is required`,
//         invalid_type_error: `${fieldName} is required`,
//       })
//       .trim()
//       .min(1, `${fieldName} is required`)
//       .pipe(
//         maxLength
//           ? z.string().max(maxLength, `${fieldName} must be at most ${maxLength} characters`)
//           : z.string(),
//       ),
//   );

export const getValidationSchema = (mode) => {
  switch (mode) {
    case MODES.CREATE:
      return createInternshipValidationSchema
    case MODES.EDIT_STATUS:
      return statusInternshipValidationSchema
    case MODES.EDIT_ADVISER:
      return adviserInternshipValidationSchema
    case MODES.EDIT_DETAILS:
      return detailsInternshipValidationSchema
    default:
      return editInternshipValidationSchema
  }
}

const createInternshipValidationSchema = z.object({
  studentId: z.string().uuid('Student is required'),
  hteId: z.string().uuid('HTE is required'),
  requiredHours: z
    .number()
    .int()
    .positive('Required hours must be a positive number')
    .optional()
    .nullable(),
})

const statusInternshipValidationSchema = z.object({
  status: z.enum(['pending', 'active', 'completed']),
})

const adviserInternshipValidationSchema = z.object({
  facultyAdviserId: z.string().uuid('Faculty Adviser is required').nullable().optional(),
})

const detailsInternshipValidationSchema = z.object({
  hteId: z.string().uuid('HTE is required').optional(),
  requiredHours: z
    .number()
    .int()
    .positive('Required hours must be a positive number')
    .optional()
    .nullable(),
})

const editInternshipValidationSchema = z.object({
  hteId: z.string().uuid('HTE is required').optional(),
  requiredHours: z
    .number()
    .int()
    .positive('Required hours must be a positive number')
    .optional()
    .nullable(),
})

export default getValidationSchema
