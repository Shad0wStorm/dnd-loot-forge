import { createId } from '../../../shared/lib/createId';
import { buildWeaponName } from './buildWeaponName';
import { buildFlavourText } from './buildFlavourText';
import { balanceWeapon } from './balanceWeapon';
import { buildAdaptiveForms, deriveWeaponForm } from './deriveWeaponForm';
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
): Tag[] {
  const tags: Tag[] = [];

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
  });

  const tags = Array.from(
    new Set([...deriveTags(input.magicalTheme, input.adaptiveFormEnabled, input.deityTag), ...effectTemplate.tags]),
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

  const weapon: GeneratedWeapon = {
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

  const balance = balanceWeapon(weapon);

  return {
    content: weapon,
    source: 'rules',
    warnings: balance.warnings,
  };
}