import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return correct / total;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'hard':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getDifficultyBgColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100';
    case 'medium':
      return 'bg-yellow-100';
    case 'hard':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
}
