import type { WeaponGenerationInput } from "./weapon.types";

export const defaultWeaponGenerationInput: WeaponGenerationInput = {
    nameMode: 'random',
    customName: '',
    weaponCategory: 'Melee',
    preferredForm: '',
    rarity: 'Uncommon',
    theme: '',
    magicalTheme: 'Fire',
    deityTag: '',
    alignmentTag: '',
    adaptiveFormEnabled: false,
    notes: ''
};

