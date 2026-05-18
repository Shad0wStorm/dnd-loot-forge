// src/ai/weaponPrompt.ts

import type { WeaponGenerationRequest } from "../rules/itemPower.types";
import { getRarityLimitProfile } from "../rules/rarityLimits";

export function buildWeaponPrompt(request: WeaponGenerationRequest): string {
  const limits = getRarityLimitProfile(request.rarity, request.powerModel);

  return `
Generate a Dungeons & Dragons 5e magic weapon.

Frontend selected options:
- Base weapon: ${request.weaponBase}
- Rarity: ${request.rarity}
- Power model: ${request.powerModel}
- Theme: ${request.theme}
- Tone: ${request.tone}
- Damage focus: ${request.damageFocus}
- Utility focus: ${request.utilityFocus}
- Curse allowed: ${request.curseAllowed}
- Attunement allowed: ${request.attunementAllowed}

Hard balance limits:
- Maximum flat attack/damage bonus: ${limits.maxFlatBonus}
- Maximum bonus damage dice: ${limits.maxBonusDamageDice}
- Maximum charges: ${limits.maxCharges}
- Extra attacks allowed: ${limits.allowExtraAttack}
- Permanent flight allowed: ${limits.allowPermanentFlight}
- At-will spells allowed: ${limits.allowAtWillSpells}
- Sentience allowed: ${limits.allowSentience}
- Scaling allowed: ${limits.allowScaling}

Rules:
- Do not invent invalid base weapon damage dice.
- Do not exceed the selected rarity.
- Do not include effects that ignore these limits.
- If the weapon is uncommon, keep it simple and modest.
- If the weapon is legendary, powerful effects are allowed but still must be readable and playable.
- If the weapon is a vestige, include Dormant, Awakened, and Exalted stages.
- Return only structured JSON.
`;
}