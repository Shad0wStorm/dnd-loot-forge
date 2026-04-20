import type {
    WeaponCategory,
    WeaponForm,
} from '../model/weapon.types';

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
            return [
                'Longsword',
                'Battleaxe',
                'Dagger',
                'Mace',
                'Quarterstaff',
                'Spear',
                'Longbow',
                'Light Crossbow',
                'Wand',
                
            ];
        default:
            return [];
    }
}

export function isFormAllowedForCateogory(
    category: WeaponCategory,
    form: WeaponForm | '',
): boolean {
    if (!form) {
        return true;
    }

    return getAllowedFormsForCategory(category).includes(form);
}