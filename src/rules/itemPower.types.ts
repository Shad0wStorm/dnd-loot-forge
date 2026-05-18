// src/rules/itemPower.types.ts

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "veryRare"
  | "legendary"
  | "artifact";

export type PowerModel =
  | "standard"
  | "cursed"
  | "sentient"
  | "vestige"
  | "deityForged"
  | "jokeItem";

export type DamageFocus =
  | "low"
  | "medium"
  | "high"
  | "extreme";

export type UtilityFocus =
  | "low"
  | "medium"
  | "high";

export type WeaponGenerationRequest = {
  weaponBase: string;
  rarity: ItemRarity;
  powerModel: PowerModel;
  theme: string;
  tone: string;
  damageFocus: DamageFocus;
  utilityFocus: UtilityFocus;
  curseAllowed: boolean;
  attunementAllowed: boolean;
};