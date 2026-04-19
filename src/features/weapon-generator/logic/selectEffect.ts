import { weaponEffectTemplates, type WeaponEffectTemplate } from '../data/effectTemplates';
import type {
  MagicalDamageType,
  Rarity,
  WeaponCategory,
  WeaponForm,
} from '../model/weapon.types';

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface SelectEffectOptions {
  rarity: Rarity;
  category: WeaponCategory;
  form: WeaponForm;
  magicalTheme: MagicalDamageType;
  adaptiveFormEnabled: boolean;
}

export function selectEffect({
  rarity,
  category,
  form,
  magicalTheme,
  adaptiveFormEnabled,
}: SelectEffectOptions): WeaponEffectTemplate {
  const effectiveCategory: WeaponCategory = adaptiveFormEnabled
    ? 'Adaptive'
    : category;

  const exactMatches = weaponEffectTemplates.filter((template) => {
    const rarityOk = template.allowedRarities.includes(rarity);
    const categoryOk = template.allowedCategories.includes(effectiveCategory);
    const formOk = template.allowedForms ? template.allowedForms.includes(form) : true;
    const themeOk = template.magicalThemes.includes(magicalTheme);

    return rarityOk && categoryOk && formOk && themeOk;
  });

  if (exactMatches.length > 0) {
    return pickRandom(exactMatches);
  }

  const fallbackMatches = weaponEffectTemplates.filter((template) => {
    const rarityOk = template.allowedRarities.includes(rarity);
    const categoryOk = template.allowedCategories.includes(effectiveCategory);
    const formOk = template.allowedForms ? template.allowedForms.includes(form) : true;

    return rarityOk && categoryOk && formOk;
  });

  if (fallbackMatches.length > 0) {
    return pickRandom(fallbackMatches);
  }

  return pickRandom(weaponEffectTemplates);
}