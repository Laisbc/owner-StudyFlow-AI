export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  goal?: string;
  mainExam?: string;
  examDate?: Date;
  timePerDay?: number;
  daysPerWeek?: number;
  knowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
  totalStudyTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  slug: string;
  description?: string;
  subject?: Subject;
}

export interface Question {
  id: string;
  enunciation: string;
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: string;
  year?: number;
  explanation?: string;
  topic?: Topic;
  alternatives?: Alternative[];
}

export interface Alternative {
  id: string;
  questionId: string;
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface Progress {
  id: string;
  userId: string;
  topicId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy?: number;
  lastAnsweredAt?: Date;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  goal?: string;
  targetDate: Date;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  userId: string;
  title: string;
  description?: string;
  totalQuestions: number;
  duration?: number;
  passPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}
