export const PLACE_CATEGORIES = [
    "Beach", "Mountain", "City", "Adventure", "Nature",
    "Lake", "Forest", "Hill", "Island", "Wetland",
    "Cultural", "International",
] as const;

export type PlaceCategory = typeof PLACE_CATEGORIES[number];