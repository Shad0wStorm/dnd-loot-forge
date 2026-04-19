import type { GeneratedWeapon } from '../model/weapon.types';

export interface BalanceCheckResult {
  valid: boolean;
  warnings: string[];
}

export function balanceWeapon(weapon: GeneratedWeapon): BalanceCheckResult {
  const warnings: string[] = [];

  const effectText = [
    weapon.mechanicalEffect,
    weapon.damageEffectNotes,
    weapon.balanceNote,
  ]
    .join(' ')
    .toLowerCase();

  const bannedPhrases = [
    'extra attack',
    'additional attack',
    'permanent invisibility',
    'unrestricted flight',
    'cast any spell',
    'at will',
  ];

  bannedPhrases.forEach((phrase) => {
    if (effectText.includes(phrase)) {
      warnings.push(`Potential overpowered phrase detected: "${phrase}"`);
    }
  });

  if (weapon.rarity === 'Common' && effectText.includes('1d4')) {
    warnings.push(
      'Common item includes burst-style extra damage. Check whether this should be uncommon.',
    );
  }

  if (weapon.tags.includes('Adaptive') && !weapon.adaptiveForms?.length) {
    warnings.push('Adaptive-tagged item has no adaptive form set.');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}