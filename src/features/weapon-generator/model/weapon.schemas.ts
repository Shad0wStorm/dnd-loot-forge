import { z } from 'zod';

export const raritySchema = z.enum(['Common', 'Uncommon']);

export const weaponCategorySchema = z.enum([
    'Melee',
    'Ranged',
    'Caster',
    'Adaptive',
]);

export const weaponFormSchema = z.enum([
    'Longsword',
    'Battleaxe',
    'Dagger',
    'Mace',
    'Spear',
    'Longbow',
    'Light Crossbow',
    'Quarterstaff',
    'Wand',
]);

export const magicalDamageTypeSchema = z.enum([
    'Arcane',
    'Fire',
    'Cold',
    'Lightning',
    'THunder',
    'Radiant',
    'Necrotic',
    'Force',
    'Psychic',
    'Poison',
]);

export const tagSchema =z.enum([
    'Divine',
    'Shadow',
    'Elemental',
    'Hunter',
    'Guardian',
    'Fortune',
    'Guild',
    'Adaptive',
    'Blessed',
    'Cursed',
]);

export const weaponGenerationInputSchema = z.object({
    nameMode: z.enum(['custom', 'random']),
    customName: z.string().max(100, 'Name must be 100 characters or less'),
    weaponCategory: weaponCategorySchema,
    preferredForm: z.union([weaponFormSchema, z.literal('')]),
    rarity: raritySchema,
    theme: z.string().min(1, 'Theme is required').max(80, 'Theme is too long'),
    magicalTheme: magicalDamageTypeSchema,
    deityTag: z.string().max(50, 'Deity tag is too long'),
    alignmentTag: z.string().max(50, 'Alignment tag is too long'),
    adaptiveFormEnabled: z.boolean,
    notes: z.string().max(300, 'Notes must be 300 characters or less')
})
.superRefine((value, ctx) => {
    if (value.nameMode === 'custom' && value.customName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customName'],
        message: 'Custom name is required when name mode is set to custom.',
      });
    }
  });

export const weaponFormProfileSchema = z.object({
    form: weaponFormSchema,
    category: weaponCategorySchema,
    baseDamageDice: z.string(),
    baseDamageType: z.enum(['Slashing', 'Piercing', 'Bludgeoning']),
    properties: z.array(z.string()),
    range: z.string().optional(),
});

export const GeneratedWeaponCardDataSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    lines: z.array(z.string()),
    footer: z.string(),
});

export const generatedWeaponSchema = z.object({
    id: z.string(),
    name:z.string(),
    rarity: raritySchema,
    form: weaponFormSchema,
    category: weaponCategorySchema,
    magicalTheme: magicalDamageTypeSchema,
    adaptiveForms: z.array(weaponFormProfileSchema).optional(),
    mechanicalEffect: z.string(),
    damageEffectNotes: z.string(),
    flavourText: z.string(),
    tags: z.array(tagSchema),
    balanceNote: z.string(),
    cardData: GeneratedWeaponCardDataSchema,
});

export type weaponGenerationInputSchemaType = z.infer<
    typeof weaponGenerationInputSchema
>;

export type GeneratedWeaponSchemaType = z.infer<typeof generatedWeaponSchema>;