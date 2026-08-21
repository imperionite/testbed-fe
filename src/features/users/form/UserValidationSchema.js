// userValidationSchema.js
import * as yup from "yup";
import {MODES} from "./formConfig"

const roleSchema = [
  "administrator",
  "internship_coordinator",
  "faculty_adviser",
  "student",
  "hte_supervisor",
];

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createUserValidationSchema;
  } 
  else if (mode === MODES.EDIT || mode === MODES.VIEW) {
    return editUserValidationSchema;
  }

  return editUserValidationSchema;
};

const createUserValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  first_name: yup
    .string()
    .required("First name is required")
    .min(1, "First name must be at least 1 character")
    .max(50, "First name must be at most 50 characters"),
  middle_name: yup
    .string()
    .optional()
    .nullable()
    .max(50, "Middle name must be at most 50 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name must be at most 50 characters"),
  suffix: yup.string().optional().nullable(),
  role: yup.string().oneOf(roleSchema).required("Role is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    ),
});

const editUserValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  first_name: yup
    .string()
    .required("First name is required")
    .min(1, "First name must be at least 1 character")
    .max(50, "First name must be at most 50 characters"),
  middle_name: yup
    .string()
    .optional()
    .nullable()
    .max(50, "Middle name must be at most 50 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name must be at most 50 characters"),
  suffix: yup.string().optional().nullable(),
  role: yup.string().oneOf(roleSchema).required("Role is required"),
  is_active: yup.boolean().required("Account status is required"),
});

export default getValidationSchema;