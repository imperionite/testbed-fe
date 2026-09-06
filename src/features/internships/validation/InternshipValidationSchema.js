import { z } from "zod";
import { MODES } from "../form/formConfig";

export const getValidationSchema = (mode) => {
  if (mode === MODES.CREATE) {
    return createInternshipValidationSchema;
  }
  return editInternshipValidationSchema;
};

const createInternshipValidationSchema = z.object({
  studentId: z.string().uuid("Student is required"),
  hteId: z.string().uuid("HTE is required"),
  requiredHours: z.number().int().positive("Required hours must be a positive number").optional().nullable(),
});

const editInternshipValidationSchema = z.object({
  hteId: z.string().uuid("HTE is required").optional(),
  requiredHours: z.number().int().positive("Required hours must be a positive number").optional().nullable(),
});

export default getValidationSchema;
