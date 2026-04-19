import {
  namePrefixesByTheme,
  neutralSuffixes,
  tagSuffixes,
} from '../data/nameParts';
import type { MagicalDamageType, Tag } from '../model/weapon.types';

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface BuildWeaponNameOptions {
  nameMode: 'custom' | 'random';
  customName: string;
  magicalTheme: MagicalDamageType;
  tags: Tag[];
}

export function buildWeaponName({
  nameMode,
  customName,
  magicalTheme,
  tags,
}: BuildWeaponNameOptions): string {
  const trimmedName = customName.trim();

  if (nameMode === 'custom' && trimmedName.length > 0) {
    return trimmedName;
  }

  const prefix = pickRandom(namePrefixesByTheme[magicalTheme]);
  const neutralCore = pickRandom(neutralSuffixes);

  const tagBasedOptions = tags.flatMap((tag) => tagSuffixes[tag] ?? []);
  const suffix =
    tagBasedOptions.length > 0
      ? pickRandom(tagBasedOptions)
      : `of ${pickRandom(['Echoes', 'Ash', 'Winter', 'Warding', 'Shadows'])}`;

  return `${prefix}${neutralCore} ${suffix}`;
}