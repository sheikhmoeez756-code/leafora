/** Care guidance derived from the catalogue itself, so the guide can never
 *  drift out of sync with what the shop actually sells. */

import { PRODUCTS, type Product } from "./products";

/** Only real plants — the ceramic pot has no care needs. */
export function livingProducts(): Product[] {
  return PRODUCTS.filter((p) => p.care.water !== "—");
}

export type CareGroup = {
  key: string;
  title: string;
  blurb: string;
  match: (p: Product) => boolean;
};

export const LIGHT_GROUPS: CareGroup[] = [
  {
    key: "low",
    title: "Low light",
    blurb:
      "North-facing rooms, hallways, that corner two metres from the window. These tolerate it and keep going.",
    match: (p) => p.care.light.toLowerCase().startsWith("low"),
  },
  {
    key: "bright-indirect",
    title: "Bright, indirect",
    blurb:
      "Near a window but out of the sun's direct path. The most common houseplant sweet spot.",
    match: (p) =>
      p.care.light.toLowerCase().includes("bright") &&
      !p.care.light.toLowerCase().includes("full"),
  },
  {
    key: "sun",
    title: "Full to part sun",
    blurb: "Outdoors, or a south-facing spot that gets several hours of direct light.",
    match: (p) => p.care.light.toLowerCase().includes("full"),
  },
  {
    key: "medium",
    title: "Medium, indirect",
    blurb: "Gentle ambient light — bright enough to read by, never a direct beam.",
    match: (p) => p.care.light.toLowerCase().startsWith("medium"),
  },
];

export const WATER_GROUPS: CareGroup[] = [
  {
    key: "fortnightly",
    title: "Every 2–3 weeks",
    blurb:
      "Drought-tolerant. The most common way to kill these is kindness — let the soil dry out completely first.",
    match: (p) => p.care.water.toLowerCase().includes("2–3 weeks"),
  },
  {
    key: "weekly",
    title: "Weekly",
    blurb:
      "Water when the top few centimetres feel dry. Drain thoroughly; never leave the pot standing in water.",
    match: (p) => p.care.water.toLowerCase().startsWith("weekly"),
  },
  {
    key: "moist",
    title: "Keep moist",
    blurb: "Soil should stay damp but never waterlogged. Check every few days in warm weather.",
    match: (p) => p.care.water.toLowerCase().includes("moist"),
  },
];

/** Products matching a group, in catalogue order. */
export function inGroup(group: CareGroup): Product[] {
  return livingProducts().filter(group.match);
}

/** Groups that actually have plants in them — avoids rendering empty sections
 *  if the catalogue changes. */
export function populated(groups: CareGroup[]): CareGroup[] {
  return groups.filter((g) => inGroup(g).length > 0);
}

export function petFriendly(): Product[] {
  return livingProducts().filter((p) => p.care.petFriendly);
}

export function toxicToPets(): Product[] {
  return livingProducts().filter((p) => !p.care.petFriendly);
}
