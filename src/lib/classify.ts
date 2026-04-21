// Stub intake classifier. In the pilot, swap this for a real vision model
// (CLIP zero-shot, MobileNet fine-tune, or a hosted inference endpoint).
// For now: it just echoes the operator's selection with a fake confidence
// and randomly flags ~15% of GREEN/BROWN batches for human review.

import type { WasteCategoryKey } from './co2';

export type ClassifyResult = {
  label: WasteCategoryKey;
  score: number;
  needsHumanReview: boolean;
};

export function classifyStub(
  operatorCategory: WasteCategoryKey,
  _photoPath?: string,
): ClassifyResult {
  const baseScore = operatorCategory === 'REJECT' ? 0.95 : 0.82 + Math.random() * 0.17;
  const flagged = operatorCategory !== 'REJECT' && Math.random() < 0.15;
  return {
    label: operatorCategory,
    score: Number(baseScore.toFixed(3)),
    needsHumanReview: flagged || baseScore < 0.7,
  };
}
