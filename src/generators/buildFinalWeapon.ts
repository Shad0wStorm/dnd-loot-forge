import type { WeaponGenerationRequest } from "../rules/itemPower.types";
import type { GeneratedWeaponDraft } from "../ai/weaponAi.types";

import { validateWeaponDraft } from "../rules/balanceValidator";

export function buildFinalWeapon(
    request: WeaponGenerationRequest,
    draft: GeneratedWeaponDraft
) {
    const validation = validateWeaponDraft(draft, request);

    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors,
            item: null,
        };
    }

    return {
        success: true,
        errors: [],
        item: {
            ...draft,
            rarity: request.rarity,
            weaponBase: request.weaponBase,
            powerModel: request.powerModel,
        },
    };
}