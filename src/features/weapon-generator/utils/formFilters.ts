import type {
    WeaponCategory,
    WeaponForm,
} from '../model/weapon.types';

const allForms: WeaponForm[] = [
    'Longsword',
    'Battleaxe',
    'Dagger',
    'Mace',
    'Spear',
    'Longbow',
    'Light Crossbow',
    'Quarterstaff',
    'Wand',
];

export function getAllowedFormsForCategory(
    category: WeaponCategory,
): WeaponForm[] {
    switch (category) {
        case 'Melee':
            return ['Longsword', 'Battleaxe', 'Dagger', 'Mace', 'Quarterstaff', 'Spear'];
        case 'Ranged':
            return ['Longbow', 'Light Crossbow'];
        case 'Caster':
            return ['Wand', 'Quarterstaff'];
        case 'Adaptive':
            return allForms;
        default:
            return allForms;
    }
}

export function isFormAllowedForCategory(
    category: WeaponCategory,
    form: WeaponForm | '',
): boolean {
    if (!form) {
        return true;
    }

    return getAllowedFormsForCategory(category).includes(form);
}