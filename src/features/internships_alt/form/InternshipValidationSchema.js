import { z } from "zod";
import { MODES } from "./formConfig";

export const INTERNSHIP_STATUSES = ["pending", "active", "completed"];

/**
 * Helper: Validates required UUID selection fields (e.g. Dropdowns)
 */
const requiredUuid = (fieldName) =>
  z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z
      .string({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} is required`,
      })
      .trim()
      .min(1, `${fieldName} is required`)
      .uuid(`Invalid ${fieldName} selected`),
  );

/**
 * Helper: Validates optional UUID selection fields
 */
const optionalUuid = (fieldName) =>
  z.preprocess(
    (val) => (val === "" || val === undefined ? null : val),
    z.string().uuid(`Invalid ${fieldName} selected`).nullable().optional(),
  );

/**
 * Helper: Preprocesses text/number inputs into positive integers or null
 */
const optionalPositiveInt = (fieldName) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const parsed = Number(val);
    return Number.isNaN(parsed) ? val : parsed;
  }, z
    .number({ invalid_type_error: `${fieldName} must be a number` })
    .int(`${fieldName} must be a whole number`)
    .positive(`${fieldName} must be greater than 0`)
    .nullable()
    .optional());


export const createInternshipValidationSchema = z.object({
  studentId: requiredUuid("Student"),
  hteId: requiredUuid("Host Training Establishment (HTE)"),
  requiredHours: optionalPositiveInt("Required hours"),
  facultyAdviserId: optionalUuid("Faculty Adviser"),
});

export const createMyInternshipValidationSchema = z.object({
  hteId: requiredUuid("Host Training Establishment (HTE)"),
});

export const editInternshipValidationSchema = z.object({
  hteId: optionalUuid("Host Training Establishment (HTE)"),
  requiredHours: optionalPositiveInt("Required hours"),
  facultyAdviserId: optionalUuid("Faculty Adviser"),
  status: z
    .enum(INTERNSHIP_STATUSES, {
      errorMap: () => ({ message: "Please select a valid status" }),
    })
    .optional(),
});

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createInternshipValidationSchema;
  }
  return editInternshipValidationSchema;
};

export default getValidationSchema;