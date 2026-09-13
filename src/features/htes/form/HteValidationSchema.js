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
          ? z.string().max(maxLength, `${fieldName} must be at most ${maxLength} characters`)
          : z.string(),
      ),
  );

const optionalNullableString = (max, message) =>
  z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.string().max(max, message).optional().nullable(),
  );

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createHteValidationSchema;
  } else if (mode === MODES.EDIT || mode === MODES.VIEW) {
    return editHteValidationSchema;
  }
  return editHteValidationSchema;
};

const createHteValidationSchema = z.object({
  company_name: requiredString("Company name", 255),

  address: requiredString("Address", 500),

  contact_person: requiredString("Contact person", 255),

  contact_email: optionalNullableString(255, "Contact email must be at most 255 characters").refine(
    (value) => value == null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Must be a valid email",
  ),

  contact_number: optionalNullableString(20, "Contact number must be at most 20 characters").refine(
    (value) => value == null || /^(09|\+639)\d{9}$/.test(value),
    "Contact number must be a valid Philippine mobile number (e.g. 09171234567)",
  ),
});

const editHteValidationSchema = z.object({
  company_name: requiredString("Company name", 255),

  address: requiredString("Address", 500),

  contact_person: requiredString("Contact person", 255),

  contact_email: optionalNullableString(255, "Contact email must be at most 255 characters").refine(
    (value) => value == null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Must be a valid email",
  ),

  contact_number: optionalNullableString(20, "Contact number must be at most 20 characters").refine(
    (value) => value == null || /^(09|\+639)\d{9}$/.test(value),
    "Contact number must be a valid Philippine mobile number (e.g. 09171234567)",
  ),

  supervisor_id: optionalNullableString(255, "Supervisor ID must be a valid ID"),

  is_active: z.boolean({ invalid_type_error: "Status is required" }),
});

export default getValidationSchema;
