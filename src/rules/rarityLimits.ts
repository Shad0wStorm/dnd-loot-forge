// src/rules/rarityLimits.ts

import type { ItemRarity, PowerModel } from "./itemPower.types";

export type RarityLimitProfile = {
  maxFlatBonus: number | "custom" | "scaling";
  maxBonusDamageDice: string | "custom" | "scaling";
  maxCharges: number | "custom" | "scaling";
  allowExtraAttack: boolean;
  allowPermanentFlight: boolean;
  allowAtWillSpells: boolean;
  allowSentience: boolean;
  allowScaling: boolean;
};

export const STANDARD_RARITY_LIMITS: Record<ItemRarity, RarityLimitProfile> = {
  common: {
    maxFlatBonus: 0,
    maxBonusDamageDice: "1d6",
    maxCharges: 0,
    allowExtraAttack: false,
    allowPermanentFlight: false,
    allowAtWillSpells: false,
    allowSentience: false,
    allowScaling: false,
  },

  uncommon: {
    maxFlatBonus: 1,
    maxBonusDamageDice: "1d6",
    maxCharges: 3,
    allowExtraAttack: false,
    allowPermanentFlight: false,
    allowAtWillSpells: false,
    allowSentience: false,
    allowScaling: false,
  },

  rare: {
    maxFlatBonus: 2,
    maxBonusDamageDice: "1d8",
    maxCharges: 5,
    allowExtraAttack: false,
    allowPermanentFlight: false,
    allowAtWillSpells: false,
    allowSentience: true,
    allowScaling: false,
  },

  veryRare: {
    maxFlatBonus: 3,
    maxBonusDamageDice: "2d8",
    maxCharges: 7,
    allowExtraAttack: false,
    allowPermanentFlight: false,
    allowAtWillSpells: false,
    allowSentience: true,
    allowScaling: false,
  },

  legendary: {
    maxFlatBonus: 3,
    maxBonusDamageDice: "3d12",
    maxCharges: 10,
    allowExtraAttack: true,
    allowPermanentFlight: true,
    allowAtWillSpells: false,
    allowSentience: true,
    allowScaling: false,
  },

  artifact: {
    maxFlatBonus: "custom",
    maxBonusDamageDice: "custom",
    maxCharges: "custom",
    allowExtraAttack: true,
    allowPermanentFlight: true,
    allowAtWillSpells: true,
    allowSentience: true,
    allowScaling: true,
  },
};

export function getRarityLimitProfile(
  rarity: ItemRarity,
  powerModel: PowerModel
): RarityLimitProfile {
  if (powerModel === "vestige") {
    return {
      maxFlatBonus: "scaling",
      maxBonusDamageDice: "scaling",
      maxCharges: "scaling",
      allowExtraAttack: true,
      allowPermanentFlight: false,
      allowAtWillSpells: false,
      allowSentience: true,
      allowScaling: true,
    };
  }

  if (powerModel === "deityForged") {
    return {
      ...STANDARD_RARITY_LIMITS[rarity],
      allowSentience: true,
      allowScaling: rarity === "legendary" || rarity === "artifact",
    };
  }

  if (powerModel === "sentient") {
    return {
      ...STANDARD_RARITY_LIMITS[rarity],
      allowSentience: true,
    };
  }

  return STANDARD_RARITY_LIMITS[rarity];
}