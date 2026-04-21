// AI routing brain — v0 is a plain rules engine over InventoryCounter rows.
// Routes a newly-approved batch to the production stage with the largest unmet demand.

import { prisma } from './prisma';
import type { ProductionStage, WasteCategory } from '@prisma/client';

const CATEGORY_STAGE_CANDIDATES: Record<WasteCategory, ProductionStage[]> = {
  GREEN: ['POULTRY', 'VEGETABLE'],
  BROWN: ['MUSHROOM', 'VEGETABLE'],
  REJECT: [],
};

export async function routeBatchToStage(
  category: WasteCategory,
  _weightKg: number,
): Promise<ProductionStage | null> {
  const candidates = CATEGORY_STAGE_CANDIDATES[category];
  if (candidates.length === 0) return null;

  const counters = await prisma.inventoryCounter.findMany({
    where: { stage: { in: candidates } },
  });
  if (counters.length === 0) return candidates[0];

  // Pick stage whose (demandKg - onHandKg) is largest.
  counters.sort((a, b) => (b.demandKg - b.onHandKg) - (a.demandKg - a.onHandKg));
  return counters[0].stage;
}
