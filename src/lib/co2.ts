// Simple CO2-diverted factor (kg CO2e per kg organic waste kept out of landfill).
// Source: rough midpoint of EPA / IPCC organics-to-landfill estimates; tune later.
export const CO2_PER_KG = {
  GREEN: 0.58,
  BROWN: 0.32,
  REJECT: 0,
} as const;

export type WasteCategoryKey = keyof typeof CO2_PER_KG;

export function co2DivertedKg(category: WasteCategoryKey, weightKg: number) {
  return (CO2_PER_KG[category] ?? 0) * weightKg;
}
