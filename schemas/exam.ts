import { z } from 'zod';

export const createExamSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  totalQuestions: z.number().min(1, 'Mínimo 1 questão'),
  duration: z.number().min(5, 'Duração mínima de 5 minutos').optional(),
  passPercentage: z.number().min(0).max(100).default(60),
  subjects: z.array(z.string()).min(1, 'Selecione pelo menos uma matéria'),
  difficulty: z.array(z.enum(['easy', 'medium', 'hard'])).optional(),
});

export const submitExamSchema = z.object({
  examId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedAnswer: z.string(),
  })),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;
export type SubmitExamInput = z.infer<typeof submitExamSchema>;
