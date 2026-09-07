import { z } from "zod";
import { MODES } from "./formConfig";

const requiredString = (fieldName, maxLength) =>
  z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z
      .string({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} is required`,
      })
      .trim()
      .min(1, `${fieldName} is required`)
      .pipe(
        maxLength
          ? z
              .string()
              .max(
                maxLength,
                `${fieldName} must be at most ${maxLength} characters`,
              )
          : z.string(),
      ),
  );

const optionalNullable = (schema) =>
  z.preprocess(
    (value) => (value === "" ? null : value),
    schema.optional().nullable(),
  );

const optionalNullableString = (max, message) =>
  optionalNullable(z.string().trim().max(max, message));

const evaluationResponsesSchema = z
  .record(
    z.string().trim().min(1),
    z.number().int().min(1).max(5),
  )
  .refine((responses) => Object.keys(responses).length > 0, {
    message: "At least one evaluation criterion must be provided.",
  });

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createEvaluationValidationSchema;
  }

  if (mode === MODES.EDIT || mode === MODES.VIEW) {
    return editEvaluationValidationSchema;
  }

  return editEvaluationValidationSchema;
};

const createEvaluationValidationSchema = z.object({
  internship_id: requiredString("Internship ID", 255),

  evaluation_type: z
    .literal("hte_supervisor")
    .optional()
    .default("hte_supervisor"),

  responses: optionalNullable(evaluationResponsesSchema),

  comments: optionalNullableString(
    2000,
    "Comments must be at most 2000 characters",
  ),
});

const editEvaluationValidationSchema = z
  .object({
    responses: optionalNullable(evaluationResponsesSchema),

    comments: optionalNullableString(
      2000,
      "Comments must be at most 2000 characters",
    ),
  })
  .refine(
    (data) => data.responses !== undefined || data.comments !== undefined,
    {
      message: "At least one evaluation field must be provided.",
    },
  );

export default getValidationSchema;
