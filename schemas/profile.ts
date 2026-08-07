import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  goal: z.string().optional(),
  mainExam: z.string().optional(),
  examDate: z.date().optional(),
  timePerDay: z.number().min(15, 'Tempo mínimo de 15 minutos').max(480, 'Tempo máximo de 8 horas').optional(),
  daysPerWeek: z.number().min(1, 'Mínimo 1 dia').max(7, 'Máximo 7 dias').optional(),
  knowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
