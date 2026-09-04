// userValidationSchema.js
import { z } from "zod";
import {MODES} from "./formConfig"

const roleSchema = [
  "administrator",
  "internship_coordinator",
  "faculty_adviser",
  "student",
  "hte_supervisor",
];

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

const roleValidator = requiredString("Role").refine(
  (value) => roleSchema.includes(value),
  "Role is required",
);

const optionalNullableString = (max, message) =>
  z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().max(max, message).optional().nullable(),
  );

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createUserValidationSchema;
  } 
  else if (mode === MODES.EDIT || mode === MODES.VIEW) {
    return editUserValidationSchema;
  }

  return editUserValidationSchema;
};

const createUserValidationSchema = z.object({
  email: requiredString("Email").refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Must be a valid email",
  ),
  first_name: requiredString("First name", 50),
  middle_name: optionalNullableString(
    50,
    "Middle name must be at most 50 characters",
  ),
  last_name: requiredString("Last name", 50),
  suffix: z.string().optional().nullable(),
  role: roleValidator,
  password: requiredString("Password")
    .refine(
      (value) => value.length >= 8,
      "Password must be at least 8 characters",
    )
    .refine(
      (value) => /[A-Z]/.test(value),
      "Password must contain at least one uppercase letter",
    )
    .refine(
      (value) => /[0-9]/.test(value),
      "Password must contain at least one number",
    )
    .refine(
      (value) => /[!@#$%^&*]/.test(value),
      "Password must contain at least one special character",
    ),
});

const editUserValidationSchema = z.object({
  email: requiredString("Email").refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Must be a valid email",
  ),
  first_name: requiredString("First name", 50),
  middle_name: optionalNullableString(
    50,
    "Middle name must be at most 50 characters",
  ),
  last_name: requiredString("Last name", 50),
  suffix: z.string().optional().nullable(),
  role: roleValidator,
  is_active: z.boolean({ invalid_type_error: "Status is required" }),
});

export default getValidationSchema;