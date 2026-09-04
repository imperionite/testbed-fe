import { z } from "zod";

// Phone number regex: accepts standard PH mobile format (e.g., 09123456789)
const phoneRegex = /^09\d{9}$/;

export const StudentValidationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  studentNumber: z.string().min(5, "Student ID must be at least 5 characters").max(20, "Student ID too long"),
  program: z.string().min(2, "Program must be at least 2 characters").max(100, "Program too long"),
  yearLevel: z.coerce.number().min(1, "Year Level must be at least 1").max(5, "Year Level must be at most 5"),
  section: z.string().max(10, "Section too long").optional().nullable(),
  contactNumber: z.string().regex(phoneRegex, "Invalid phone number format").optional().nullable(),
  address: z.string().min(5, "Address too short").max(255, "Address too long").optional().nullable(),
  emergencyContactName: z.string().min(2, "Name too short").max(100, "Name too long").optional().nullable(),
  emergencyContactNumber: z.string().regex(phoneRegex, "Invalid phone number format").optional().nullable(),
  internshipStatus: z.enum(["pending", "active", "completed", "dropped"]),
});
