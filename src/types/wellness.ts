export const WELLNESS_GOALS = [
  "Protein & Fitness",
  "Everyday Wellness",
  "Digestion",
  "Immunity",
  "Traditional Nutrition",
] as const;

export const PRODUCT_INTERESTS = [
  "Millet Protein",
  "Moringa Soup",
  "Methi Balls",
  "Kashaya",
] as const;

export type WellnessGoal = (typeof WELLNESS_GOALS)[number];
export type ProductInterest = (typeof PRODUCT_INTERESTS)[number];