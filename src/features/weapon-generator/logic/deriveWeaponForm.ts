import { weaponFormProfiles } from "../model/weaponForms";
import type {
    WeaponCategory,
    WeaponForm, 
    WeaponFormProfile,
} from '../model/weapon.types';

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

function getFallbackFormsForCategory(category: WeaponCategory): WeaponFormProfile[] {
    if (category === 'Adaptive') {
        return weaponFormProfiles;
    }

    return weaponFormProfiles.filter((profile) => profile.category === category);
}

export function deriveWeaponForm(
    category: WeaponCategory,
    preferredForm: WeaponForm | '',
): WeaponFormProfile {
    if (preferredForm) {
        const exactMatch = weaponFormProfiles.find(
            (profile) => profile.form === preferredForm,
        );

        if (exactMatch) {
            return exactMatch;
        }
    }

    const availableForms = getFallbackFormsForCategory(category);

    return pickRandom(availableForms);
}

export function buildAdaptiveForms(primaryForm: WeaponForm): WeaponFormProfile[] {
    const preferredOrder: WeaponForm[] =[
        primaryForm,
        'Longsword',
        'Battleaxe',
        'Longbow',
        'Light Crossbow',
        'Quarterstaff',
        'Spear',
        'Dagger',
        'Mace',
    ];

    const uniqueForms = Array.from(new Set(preferredOrder));

    return uniqueForms
        .map((form) => weaponFormProfiles.find((profile) => profile.form === form))
        .filter((profile): profile is WeaponFormProfile => Boolean(profile))
        .slice(0, 4);
}

