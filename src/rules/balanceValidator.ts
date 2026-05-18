// src/rules/balanceValidator.ts

import type { GeneratedWeaponDraft } from "../ai/weaponAi.types";
import type { WeaponGenerationRequest } from "./itemPower.types";
import { getRarityLimitProfile } from "./rarityLimits";

export type BalanceValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateWeaponDraft(
  draft: GeneratedWeaponDraft,
  request: WeaponGenerationRequest
): BalanceValidationResult {
  const limits = getRarityLimitProfile(request.rarity, request.powerModel);
  const errors: string[] = [];

  const rules = draft.rulesText.toLowerCase();

  if (!limits.allowExtraAttack && rules.includes("extra attack")) {
    errors.push("Extra attacks are not allowed for this rarity/power model.");
  }

  if (!limits.allowPermanentFlight && rules.includes("flying speed")) {
    errors.push("Permanent flight is not allowed for this rarity/power model.");
  }

  if (!limits.allowAtWillSpells && rules.includes("at will")) {
    errors.push("At-will spellcasting is not allowed for this rarity/power model.");
  }

  if (!request.curseAllowed && draft.curseText) {
    errors.push("Curse text was generated even though curses are disabled.");
  }

  if (!request.attunementAllowed && draft.requiresAttunement) {
    errors.push("Attunement was added even though attunement is disabled.");
  }

  if (
    request.rarity === "uncommon" &&
    (rules.includes("4d12") || rules.includes("+3") || rules.includes("legendary"))
  ) {
    errors.push("Generated item appears too powerful for uncommon rarity.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}