// src/ai/weaponPrompt.ts

import type { WeaponGenerationRequest } from "../rules/itemPower.types";
import { getRarityLimitProfile } from "../rules/rarityLimits";

export function buildWeaponPrompt(request: WeaponGenerationRequest): string {
  const limits = getRarityLimitProfile(request.rarity, request.powerModel);

  return `
Generate a Dungeons & Dragons 5e magic weapon.

Frontend selected options:
- Base weapon: ${request.weaponBase}
- Weapon category: ${request.weaponCategory}
- Base damage: ${request.baseDamageDice} ${request.baseDamageType}
- Base properties: ${request.baseProperties.join(", ") || "None"}
- Base range: ${request.baseRange ?? "None"}
- Rarity: ${request.rarity}
- Power model: ${request.powerModel}
- Theme: ${request.theme}
- Magical theme: ${request.magicalTheme}
- Name mode: ${request.nameMode}
- Custom name: ${request.customName || "None"}
- Deity tag: ${request.deityTag || "None"}
- Alignment/theme tag: ${request.alignmentTag || "None"}
- Adaptive form support: ${request.adaptiveFormEnabled}
- Generation notes: ${request.notes || "None"}
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
- Use the selected frontend options as the source of truth.
- Build the final weapon from the selected 5e base weapon and its listed damage/properties.
- Do not invent invalid base weapon damage dice, properties, ranges, or weapon categories.
- Do not exceed the selected rarity.
- Do not include effects that ignore these limits.
- If the weapon is common, it should be mostly flavour with a tiny situational benefit.
- If the weapon is uncommon, keep it simple, modest, and suitable for low-level play.
- Do not grant broad always-on advantage, repeated save-or-suck effects, permanent flight, or free extra attacks unless explicitly allowed by the limits.
- If the weapon is a vestige, include Dormant, Awakened, and Exalted stages.
- If a custom name is provided, use it exactly as the item name.
- Return only structured JSON.
`;
}
