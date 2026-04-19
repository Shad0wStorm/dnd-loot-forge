export type Rarity = 'Common' | 'Uncommon';

export type WeaponCategory = 'Melee' | 'Ranged' | 'Caster' | 'Adaptive';

export type WeaponForm = 
    | 'Longsword'
    | 'Battleaxe'
    | 'Dagger'
    | 'Mace'
    | 'Spear'
    | 'Longbow'
    | 'Light Crossbow'
    | 'Quarterstaff'
    | 'Wand';

export type BaseDamageType = 'Slashing' | 'Piercing' | 'Bludgeoning';

export type MagicalDamageType = 
    |   'Arcane'
    |   'Fire'
    |   'Cold'
    |   'Lightning'
    |   'Thunder'
    |   'Radiant'
    |   'Necrotic'
    |   'Force'
    |   'Psychic'
    |   'Poison';

export type Tag = 
    |   'Divine'
    |   'Shadow'
    |   'Elemental'
    |   'Hunter'
    |   'Guardian'
    |   'Fortune'
    |   'Guild'
    |   'Adaptive'
    |   'Arcane'
    |   'Blessed'
    |   'Cursed';


export interface WeaponGenerationInput {
    nameMode: 'custom' | 'random';
    customName: string;
    weaponCategory: WeaponCategory;
    preferredForm: WeaponForm | '';
    rarity: Rarity;
    theme: string;
    magicalTheme: MagicalDamageType;
    deityTag: string;
    alignmentTag: string;
    adaptiveFormEnabled: boolean;
    notes: string;
}

export interface WeaponFormProfile {
    form: WeaponForm;
    category: WeaponCategory;
    baseDamageDice: string;
    baseDamageType: BaseDamageType;
    properties: string[];
    range?: string;
}

export interface GeneratedWeaponCardData {
    title: string;
    subtitle: string;
    lines: string[];
    footer: string;
}

export interface GeneratedWeapon {
    id: string;
    name: string;
    rarity: Rarity;
    form: WeaponForm;
    category: WeaponCategory;
    magicalTheme: MagicalDamageType;
    adaptiveForms?: WeaponFormProfile[];
    mechanicalEffect: string;
    damageEffectNotes: string;
    flavourText: string;
    tags: Tag[];
    balanceNote: string;
    cardData: GeneratedWeaponCardData;
}

export interface GeneratorResult<T> {
    content: T;
    source: 'rules' | 'ai' | 'hybrid';
    warnings: string[];
}
