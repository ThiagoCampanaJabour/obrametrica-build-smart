import { z, ZodError } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Email inválido'),
  name: z.string().min(1, 'Nome é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional(),
})

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  description: z.string().optional(),
  userId: z.string().uuid('ID de usuário inválido'),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
export type Project = z.infer<typeof projectSchema>
export type Pagination = z.infer<typeof paginationSchema>

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Erro de validação desconhecido' } }
  }
}
