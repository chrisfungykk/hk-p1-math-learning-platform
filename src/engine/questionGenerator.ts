import { v4 as uuidv4 } from 'uuid';
import type { Question, QuestionGeneratorConfig } from '../types';
import { TOPIC_REGISTRY } from '../data/topicRegistry';

/**
 * Main entry point for question generation.
 * Looks up the topic in TOPIC_REGISTRY and delegates to the topic-specific generator.
 */
export function generateQuestions(config: QuestionGeneratorConfig): Question[] {
  const topic = TOPIC_REGISTRY[config.topicId];

  if (!topic) {
    throw new Error(`Invalid topicId: "${config.topicId}" is not found in the topic registry.`);
  }

  if (config.count <= 0) {
    return [];
  }

  return topic.generateQuestions(config.difficulty, config.count);
}

/**
 * Generates a unique ID using UUID v4.
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Returns a random integer in [min, max] inclusive.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fisher-Yates shuffle — returns a new shuffled copy of the array.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
