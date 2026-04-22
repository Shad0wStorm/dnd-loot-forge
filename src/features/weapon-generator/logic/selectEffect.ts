import {
  weaponEffectTemplates,
  type EffectBiasBucket,
  type WeaponEffectTemplate,
} from '../data/effectTemplates';
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
  theme: string;
  deityTag: string;
  alignmentTag: string;
  notes: string;
}

function getBiasBucketsFromText(
  text: string,
  magicalTheme: MagicalDamageType,
  adaptiveFormEnabled: boolean,
): EffectBiasBucket[] {
  const lower = text.toLowerCase();
  const buckets = new Set<EffectBiasBucket>();

  if (['Fire', 'Cold', 'Lightning', 'Thunder'].includes(magicalTheme)) {
    buckets.add('elemental');
  }

  if (['Radiant'].includes(magicalTheme)) {
    buckets.add('divine');
  }

  if (['Necrotic', 'Psychic'].includes(magicalTheme)) {
    buckets.add('shadow');
  }

  if (adaptiveFormEnabled) {
    buckets.add('guild');
  }

  const keywordMap: Array<[EffectBiasBucket, string[]]> = [
    ['guardian', ['guardian', 'guard', 'ward', 'protect', 'shield', 'defend', 'watch']],
    ['hunter', ['hunter', 'hunt', 'track', 'tracking', 'prey', 'pursuit']],
    ['shadow', ['shadow', 'veil', 'grave', 'secret', 'stealth', 'curse', 'cursed', 'dark']],
    ['divine', ['divine', 'saint', 'god', 'holy', 'blessed', 'radiant', 'mercy']],
    ['guild', ['guild', 'contract', 'adaptive', 'versatile', 'tool', 'crafted']],
    ['fortune', ['fortune', 'luck', 'lucky', 'chance', 'fate', 'omen']],
    ['elemental', ['fire', 'cold', 'storm', 'lightning', 'thunder', 'frost', 'ember']],
    ['utility', ['ritual', 'utility', 'sense', 'warning', 'detect', 'notice', 'relic']],
  ];

  keywordMap.forEach(([bucket, words]) => {
    if (words.some((word) => lower.includes(word))) {
      buckets.add(bucket);
    }
  });

  return Array.from(buckets);
}

function scoreTemplate(
  template: WeaponEffectTemplate,
  desiredBuckets: EffectBiasBucket[],
): number {
  if (desiredBuckets.length === 0) {
    return Math.random();
  }

  let score = Math.random();

  desiredBuckets.forEach((bucket) => {
    if (template.biasBuckets.includes(bucket)) {
      score += 3;
    }
  });

  if (template.biasBuckets.length === 1 && desiredBuckets.includes(template.biasBuckets[0])) {
    score += 0.5;
  }

  return score;
}

export function selectEffect({
  rarity,
  category,
  form,
  magicalTheme,
  adaptiveFormEnabled,
  theme,
  deityTag,
  alignmentTag,
  notes,
}: SelectEffectOptions): WeaponEffectTemplate {
  const effectiveCategory: WeaponCategory = adaptiveFormEnabled
    ? 'Adaptive'
    : category;

  const desiredBuckets = getBiasBucketsFromText(
    `${theme} ${deityTag} ${alignmentTag} ${notes}`,
    magicalTheme,
    adaptiveFormEnabled,
  );

  const exactMatches = weaponEffectTemplates.filter((template) => {
    const rarityOk = template.allowedRarities.includes(rarity);
    const categoryOk = template.allowedCategories.includes(effectiveCategory);
    const formOk = template.allowedForms ? template.allowedForms.includes(form) : true;
    const themeOk = template.magicalThemes.includes(magicalTheme);

    return rarityOk && categoryOk && formOk && themeOk;
  });

  if (exactMatches.length > 0) {
    return [...exactMatches].sort(
      (a, b) => scoreTemplate(b, desiredBuckets) - scoreTemplate(a, desiredBuckets),
    )[0];
  }

  const fallbackMatches = weaponEffectTemplates.filter((template) => {
    const rarityOk = template.allowedRarities.includes(rarity);
    const categoryOk = template.allowedCategories.includes(effectiveCategory);
    const formOk = template.allowedForms ? template.allowedForms.includes(form) : true;

    return rarityOk && categoryOk && formOk;
  });

  if (fallbackMatches.length > 0) {
    return [...fallbackMatches].sort(
      (a, b) => scoreTemplate(b, desiredBuckets) - scoreTemplate(a, desiredBuckets),
    )[0];
  }

  return pickRandom(weaponEffectTemplates);
}