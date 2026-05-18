import { createId } from '../../../shared/lib/createId';
import { generateWeaponDraftWithAi } from '../../../ai/weaponAiClient';
import { buildFinalWeapon } from '../../../generators/buildFinalWeapon';
import type {
  DamageFocus,
  ItemRarity,
  PowerModel,
  UtilityFocus,
  WeaponGenerationRequest,
} from '../../../rules/itemPower.types';
import { balanceWeapon } from './balanceWeapon';
import { buildAdaptiveForms, deriveWeaponForm } from './deriveWeaponForm';
import { estimateGoldValue } from './estimateGoldValue';
import type {
  GeneratedWeapon,
  GeneratorResult,
  MagicalDamageType,
  Rarity,
  Tag,
  WeaponGenerationInput,
} from '../model/weapon.types';
import type { WeaponFormProfile } from '../model/weapon.types';

const rarityMap: Record<Rarity, ItemRarity> = {
  Common: 'common',
  Uncommon: 'uncommon',
  Rare: 'rare',
  'Very Rare': 'veryRare',
  Legendary: 'legendary',
};

function derivePowerModel(input: WeaponGenerationInput): PowerModel {
  const combinedText = `${input.theme} ${input.notes} ${input.alignmentTag}`.toLowerCase();

  if (combinedText.includes('sentient')) {
    return 'sentient';
  }

  if (combinedText.includes('vestige')) {
    return 'vestige';
  }

  if (combinedText.includes('deity') || input.deityTag.trim()) {
    return 'deityForged';
  }

  if (combinedText.includes('joke')) {
    return 'jokeItem';
  }

  if (combinedText.includes('curse') || combinedText.includes('cursed')) {
    return 'cursed';
  }

  return 'standard';
}

function deriveDamageFocus(input: WeaponGenerationInput): DamageFocus {
  const combinedText = `${input.theme} ${input.notes}`.toLowerCase();

  if (combinedText.includes('extreme')) {
    return 'extreme';
  }

  if (combinedText.includes('high damage') || combinedText.includes('deadly')) {
    return 'high';
  }

  if (input.rarity === 'Common') {
    return 'low';
  }

  return 'medium';
}

function deriveUtilityFocus(input: WeaponGenerationInput): UtilityFocus {
  const combinedText = `${input.theme} ${input.notes}`.toLowerCase();

  if (['guardian', 'tracking', 'stealth', 'ritual', 'utility'].some((word) =>
    combinedText.includes(word),
  )) {
    return 'high';
  }

  return input.rarity === 'Common' ? 'low' : 'medium';
}

function deriveTags(
  magicalTheme: MagicalDamageType,
  input: WeaponGenerationInput,
  hasCurseText: boolean,
): Tag[] {
  const tags: Tag[] = [];
  const combinedText = `${input.theme} ${input.notes} ${input.deityTag} ${input.alignmentTag}`.toLowerCase();

  if (['Fire', 'Cold', 'Lightning', 'Thunder'].includes(magicalTheme)) {
    tags.push('Elemental');
  }

  if (magicalTheme === 'Arcane' || magicalTheme === 'Force') {
    tags.push('Arcane');
  }

  if (magicalTheme === 'Radiant' || input.deityTag.trim()) {
    tags.push('Divine', 'Blessed');
  }

  if (magicalTheme === 'Necrotic' || magicalTheme === 'Psychic') {
    tags.push('Shadow');
  }

  if (combinedText.includes('hunter') || combinedText.includes('hunt')) {
    tags.push('Hunter');
  }

  if (combinedText.includes('guardian') || combinedText.includes('ward')) {
    tags.push('Guardian');
  }

  if (combinedText.includes('luck') || combinedText.includes('fortune')) {
    tags.push('Fortune');
  }

  if (input.adaptiveFormEnabled) {
    tags.push('Adaptive', 'Guild');
  }

  if (hasCurseText) {
    tags.push('Cursed');
  }

  return Array.from(new Set(tags));
}

function toWeaponGenerationRequest(input: WeaponGenerationInput): {
  request: WeaponGenerationRequest;
  selectedForm: WeaponFormProfile;
} {
  const selectedForm = deriveWeaponForm(input.weaponCategory, input.preferredForm);
  const powerModel = derivePowerModel(input);

  return {
    selectedForm,
    request: {
    weaponBase: selectedForm.form,
    weaponCategory: input.weaponCategory,
    baseDamageDice: selectedForm.baseDamageDice,
    baseDamageType: selectedForm.baseDamageType,
    baseProperties: selectedForm.properties,
    baseRange: selectedForm.range,
    rarity: rarityMap[input.rarity],
    powerModel,
    theme: input.theme,
    magicalTheme: input.magicalTheme,
    nameMode: input.nameMode,
    customName: input.customName,
    deityTag: input.deityTag,
    alignmentTag: input.alignmentTag,
    adaptiveFormEnabled: input.adaptiveFormEnabled,
    notes: input.notes,
    tone: input.alignmentTag || input.notes || 'adventurous fantasy',
    damageFocus: deriveDamageFocus(input),
    utilityFocus: deriveUtilityFocus(input),
    curseAllowed: powerModel === 'cursed',
    attunementAllowed: input.rarity !== 'Common',
    },
  };
}

export async function buildAiWeapon(
  input: WeaponGenerationInput,
): Promise<GeneratorResult<GeneratedWeapon>> {
  const { request, selectedForm } = toWeaponGenerationRequest(input);
  const draft = await generateWeaponDraftWithAi(request);
  const finalWeapon = buildFinalWeapon(request, draft);

  if (!finalWeapon.success || !finalWeapon.item) {
    throw new Error(finalWeapon.errors.join(' ') || 'AI draft failed balance validation.');
  }

  const tags = deriveTags(input.magicalTheme, input, Boolean(draft.curseText));

  const draftWeapon: GeneratedWeapon = {
    id: createId('weapon'),
    name: draft.name,
    rarity: input.rarity,
    form: selectedForm.form,
    category: selectedForm.category,
    magicalTheme: input.magicalTheme,
    adaptiveForms: input.adaptiveFormEnabled
      ? buildAdaptiveForms(selectedForm.form)
      : undefined,
    mechanicalEffect: draft.rulesText,
    damageEffectNotes: `${selectedForm.baseDamageDice} ${selectedForm.baseDamageType}. ${draft.summary}`,
    flavourText: draft.flavourText,
    tags,
    balanceNote: draft.balanceNotes,
    estimatedGoldValue: {
      low: draft.estimatedGoldValue,
      high: draft.estimatedGoldValue,
      display: `${draft.estimatedGoldValue} gp`,
    },
    cardData: {
      title: draft.name,
      subtitle: `${input.rarity} ${selectedForm.form}`,
      lines: [
        `Theme: ${input.magicalTheme}`,
        `Effect: ${draft.rulesText}`,
        `Base: ${selectedForm.baseDamageDice} ${selectedForm.baseDamageType}`,
        `Value: ${draft.estimatedGoldValue} gp`,
      ],
      footer: draft.balanceNotes,
    },
  };

  const estimatedGoldValue = estimateGoldValue(draftWeapon);
  const weapon: GeneratedWeapon = {
    ...draftWeapon,
    estimatedGoldValue,
  };
  const balance = balanceWeapon(weapon);

  return {
    content: weapon,
    source: 'ai',
    warnings: balance.warnings,
  };
}
