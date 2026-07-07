import { describe, it, expect } from 'vitest'
import { validateData, userSchema } from '@/lib/validation'

describe('Validation', () => {
  it('should validate correct user data', () => {
    const validData = {
      email: 'test@example.com',
      name: 'John Doe',
    }

    const result = validateData(userSchema, validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      name: 'John Doe',
    }

    const result = validateData(userSchema, invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject missing required fields', () => {
    const incompleteData = {
      email: 'test@example.com',
    }

    const result = validateData(userSchema, incompleteData)
    expect(result.success).toBe(false)
  })
})
