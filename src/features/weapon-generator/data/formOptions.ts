import type {
    MagicalDamageType,
    Rarity,
    WeaponCategory,
    WeaponForm
} from '../model/weapon.types';

export const rarityOptions: Rarity[] = ['Common', 'Uncommon'];

export const weaponCategoryOptions: WeaponCategory[] =[
    'Melee',
    'Ranged',
    'Caster',
    'Adaptive',
];

export const weaponFormOptions: WeaponForm[] = [
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

export const magicalThemeOptions: MagicalDamageType[] = [
    'Arcane',
    'Fire',
    'Cold',
    'Lightning',
    'Thunder',
    'Radiant',
    'Necrotic',
    'Force',
    'Psychic',
    'Poison'
];