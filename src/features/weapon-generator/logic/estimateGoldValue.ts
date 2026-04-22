import type {
  GeneratedWeapon,
  GoldValueEstimate,
} from '../model/weapon.types';

export function estimateGoldValue(
  weapon: GeneratedWeapon,
): GoldValueEstimate {
  let low = weapon.rarity === 'Common' ? 50 : 101;
  let high = weapon.rarity === 'Common' ? 100 : 500;

  const effectText = `${weapon.mechanicalEffect} ${weapon.damageEffectNotes}`.toLowerCase();
  const tags = new Set(weapon.tags);

  if (tags.has('Adaptive')) {
    low += 75;
    high += 125;
  }

  if (tags.has('Divine') || tags.has('Blessed')) {
    low += 15;
    high += 40;
  }

  if (tags.has('Hunter') || tags.has('Guardian')) {
    low += 20;
    high += 35;
  }

  if (effectText.includes('extra 1 fire damage')) {
    low += 30;
    high += 60;
  }

  if (effectText.includes('extra 1d4')) {
    low += 45;
    high += 90;
  }

  if (effectText.includes('once per long rest')) {
    low += 10;
    high += 35;
  }

  if (effectText.includes('sheds dim light')) {
    high -= 15;
  }

  if (effectText.includes('undead come within 30 feet')) {
    high -= 25;
  }

  if (effectText.includes('information effect only')) {
    high -= 15;
  }

  const rarityFloorLow = weapon.rarity === 'Common' ? 50 : 101;
  const rarityFloorHigh = weapon.rarity === 'Common' ? 100 : 150;

  low = Math.max(low, rarityFloorLow);
  high = Math.max(high, Math.max(rarityFloorHigh, low + 25));

  return {
    low,
    high,
    display: `${low}-${high} gp`,
  };
}