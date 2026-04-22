import { createId } from '../../../shared/lib/createId';
import { buildWeaponName } from './buildWeaponName';
import { buildFlavourText } from './buildFlavourText';
import { balanceWeapon } from './balanceWeapon';
import { buildAdaptiveForms, deriveWeaponForm } from './deriveWeaponForm';
import { estimateGoldValue } from './estimateGoldValue';
import { selectEffect } from './selectEffect';
import type {
  GeneratedWeapon,
  GeneratorResult,
  Tag,
  WeaponGenerationInput,
} from '../model/weapon.types';

function deriveTags(
  magicalTheme: WeaponGenerationInput['magicalTheme'],
  adaptiveFormEnabled: boolean,
  deityTag: string,
  alignmentTag: string,
  theme: string,
  notes: string,
): Tag[] {
  const tags: Tag[] = [];
  const combinedText = `${deityTag} ${alignmentTag} ${theme} ${notes}`.toLowerCase();

  if (['Fire', 'Cold', 'Lightning', 'Thunder'].includes(magicalTheme)) {
    tags.push('Elemental');
  }

  if (['Radiant'].includes(magicalTheme)) {
    tags.push('Divine', 'Blessed');
  }

  if (['Necrotic', 'Psychic'].includes(magicalTheme)) {
    tags.push('Shadow');
  }

  if (deityTag.trim()) {
    tags.push('Divine');
  }

  if (
    ['hunter', 'hunt', 'track', 'tracking', 'prey', 'pursuit'].some((word) =>
      combinedText.includes(word),
    )
  ) {
    tags.push('Hunter');
  }

  if (
    ['guardian', 'guard', 'ward', 'protect', 'shield', 'defend'].some((word) =>
      combinedText.includes(word),
    )
  ) {
    tags.push('Guardian');
  }

  if (
    ['fortune', 'luck', 'lucky', 'chance', 'omen', 'fate'].some((word) =>
      combinedText.includes(word),
    )
  ) {
    tags.push('Fortune');
  }

  if (
    ['curse', 'cursed', 'grave', 'dark', 'shadow', 'secret', 'veil'].some((word) =>
      combinedText.includes(word),
    )
  ) {
    tags.push('Shadow');
    tags.push('Cursed');
  }

  if (adaptiveFormEnabled) {
    tags.push('Adaptive', 'Guild');
  }

  return Array.from(new Set(tags));
}

export function buildWeapon(
  input: WeaponGenerationInput,
): GeneratorResult<GeneratedWeapon> {
  const selectedForm = deriveWeaponForm(input.weaponCategory, input.preferredForm);

  const effectTemplate = selectEffect({
    rarity: input.rarity,
    category: input.weaponCategory,
    form: selectedForm.form,
    magicalTheme: input.magicalTheme,
    adaptiveFormEnabled: input.adaptiveFormEnabled,
    theme: input.theme,
    deityTag: input.deityTag,
    alignmentTag: input.alignmentTag,
    notes: input.notes,
  });

  const tags = Array.from(
    new Set([
      ...deriveTags(
        input.magicalTheme,
        input.adaptiveFormEnabled,
        input.deityTag,
        input.alignmentTag,
        input.theme,
        input.notes,
      ),
      ...effectTemplate.tags,
    ]),
  );

  const name = buildWeaponName({
    nameMode: input.nameMode,
    customName: input.customName,
    magicalTheme: input.magicalTheme,
    tags,
  });

  const flavourText = buildFlavourText({
    theme: input.theme,
    deityTag: input.deityTag,
    alignmentTag: input.alignmentTag,
    flavourPattern: effectTemplate.flavourPattern,
  });

  const draftWeapon: GeneratedWeapon = {
    id: createId('weapon'),
    name,
    rarity: input.rarity,
    form: selectedForm.form,
    category: input.weaponCategory,
    magicalTheme: input.magicalTheme,
    adaptiveForms: input.adaptiveFormEnabled
      ? buildAdaptiveForms(selectedForm.form)
      : undefined,
    mechanicalEffect: effectTemplate.mechanicalEffect,
    damageEffectNotes: `${selectedForm.baseDamageDice} ${selectedForm.baseDamageType}. ${effectTemplate.damageEffectNotes}${
      selectedForm.range ? ` Range ${selectedForm.range}.` : ''
    }`,
    flavourText,
    tags,
    balanceNote: effectTemplate.balanceNote,
    estimatedGoldValue: {
      low: 0,
      high: 0,
      display: '',
    },
    cardData: {
      title: name,
      subtitle: `${input.rarity} ${selectedForm.form}`,
      lines: [
        `Theme: ${input.magicalTheme}`,
        `Effect: ${effectTemplate.mechanicalEffect}`,
        `Base: ${selectedForm.baseDamageDice} ${selectedForm.baseDamageType}`,
        `Tags: ${tags.join(', ') || 'None'}`,
      ],
      footer: effectTemplate.balanceNote,
    },
  };

  const estimatedGoldValue = estimateGoldValue(draftWeapon);

  const weapon: GeneratedWeapon = {
    ...draftWeapon,
    estimatedGoldValue,
    cardData: {
      ...draftWeapon.cardData,
      lines: [
        `Theme: ${input.magicalTheme}`,
        `Effect: ${effectTemplate.mechanicalEffect}`,
        `Base: ${selectedForm.baseDamageDice} ${selectedForm.baseDamageType}`,
        `Value: ${estimatedGoldValue.display}`,
      ],
    },
  };

  const balance = balanceWeapon(weapon);

  return {
    content: weapon,
    source: 'rules',
    warnings: balance.warnings,
  };
}