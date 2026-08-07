import { z } from 'zod';

export const questionSchema = z.object({
  enunciation: z.string().min(10, 'Enunciado deve ter pelo menos 10 caracteres'),
  topicId: z.string().min(1, 'Tópico é obrigatório'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  source: z.string().optional(),
  year: z.number().optional(),
  explanation: z.string().optional(),
});

export const answerQuestionSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.string(),
  timeSpent: z.number().optional(),
});

export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;
