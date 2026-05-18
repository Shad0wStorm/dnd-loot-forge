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
  weaponCategory: string;
  baseDamageDice: string;
  baseDamageType: string;
  baseProperties: string[];
  baseRange?: string;
  rarity: ItemRarity;
  powerModel: PowerModel;
  theme: string;
  magicalTheme: string;
  nameMode: "custom" | "random";
  customName: string;
  deityTag: string;
  alignmentTag: string;
  adaptiveFormEnabled: boolean;
  notes: string;
  tone: string;
  damageFocus: DamageFocus;
  utilityFocus: UtilityFocus;
  curseAllowed: boolean;
  attunementAllowed: boolean;
};
