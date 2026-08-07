import { describe, it, expect } from 'vitest';
import { cn, formatPercentage, calculateAccuracy, getDifficultyColor } from '@/lib/utils';

describe('Utils Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2', 'py-2', { 'bg-red-500': true, 'text-white': false });
      expect(result).toContain('px-2');
      expect(result).toContain('py-2');
      expect(result).toContain('bg-red-500');
      expect(result).not.toContain('text-white');
    });
  });

  describe('formatPercentage', () => {
    it('should format number as percentage', () => {
      expect(formatPercentage(0.75)).toBe('75%');
      expect(formatPercentage(1)).toBe('100%');
      expect(formatPercentage(0)).toBe('0%');
      expect(formatPercentage(0.333)).toBe('33%');
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      expect(calculateAccuracy(8, 10)).toBe(0.8);
      expect(calculateAccuracy(5, 10)).toBe(0.5);
      expect(calculateAccuracy(10, 10)).toBe(1);
      expect(calculateAccuracy(0, 10)).toBe(0);
    });

    it('should return 0 when total is 0', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });
  });

  describe('getDifficultyColor', () => {
    it('should return correct color for each difficulty', () => {
      expect(getDifficultyColor('easy')).toBe('text-green-600');
      expect(getDifficultyColor('medium')).toBe('text-yellow-600');
      expect(getDifficultyColor('hard')).toBe('text-red-600');
      expect(getDifficultyColor('unknown')).toBe('text-gray-600');
    });
  });
});
