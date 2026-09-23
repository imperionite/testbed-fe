import { z } from 'zod'

import { EVALUATION_CRITERIA } from './evaluationConfig'

/**
 * Build the response schema from the approved evaluation criteria.
 *
 * Every criterion is optional because the backend supports partial
 * responses while an evaluation is being completed as a draft.
 *
 * A value, when provided, must be an integer from 1 to 5.
 */
const responseFields = Object.fromEntries(
  EVALUATION_CRITERIA.map(({ key }) => [key, z.number().int().min(1).max(5).optional()]),
)

const responsesSchema = z
  .object(responseFields)
  .strict()
  .refine((responses) => Object.values(responses).some((value) => value !== undefined), {
    message: 'Rate at least one evaluation criterion.',
  })

export const createEvaluationSchema = z.object({
  internship_id: z.string().uuid('Please select an internship.'),

  evaluation_type: z.enum(['hte_supervisor', 'faculty_adviser']),

  responses: responsesSchema,

  comments: z
    .string()
    .trim()
    .max(2000, 'Comments must not exceed 2000 characters.')
    .optional()
    .nullable(),
})

export const updateEvaluationSchema = z.object({
  responses: responsesSchema,

  comments: z
    .string()
    .trim()
    .max(2000, 'Comments must not exceed 2000 characters.')
    .optional()
    .nullable(),
})

export function getValidationSchema(mode) {
  return mode === 'create' ? createEvaluationSchema : updateEvaluationSchema
}

export { EVALUATION_CRITERIA }
