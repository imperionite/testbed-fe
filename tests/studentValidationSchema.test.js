import { describe, expect, it } from 'vitest'
import { StudentValidationSchema } from '../src/features/students/form/StudentValidationSchema'

const validStudent = {
  userId: 'user-1',
  studentNumber: 'STU12345',
  program: 'Computer Science',
  yearLevel: 3,
  section: '',
  contactNumber: '',
  address: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
}

describe('StudentValidationSchema', () => {
  it('allows blank optional contact fields', () => {
    expect(StudentValidationSchema.safeParse(validStudent).success).toBe(true)
  })

  it('rejects invalid phone numbers', () => {
    const result = StudentValidationSchema.safeParse({
      ...validStudent,
      contactNumber: '12345',
    })

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Invalid phone number format')
  })
})