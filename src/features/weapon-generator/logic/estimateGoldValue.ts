import type { GeneratedWeapon,
    GoldValueEstimate,
 } from "../model";

export function estimateGoldValue(
    weapon:GeneratedWeapon,
):  GoldValueEstimate {
    let low = weapon.rarity === 'Common' ? 50 : 101;
    let high = weapon.rarity === 'Common' ? 100 : 500;

    const tags = new Set(weapon.tags);

    if (tags.has('Adaptive')) {
        low += 75;
        high += 125;
    }

    if (
        weapon.mechanicalEffect.toLowerCase().includes('extra 1 fire damage') ||
        weapon.mechanicalEffect.toLowerCase().includes('extra 1d4')
    ) {
        low += 40;
        high += 75;
    }

    if (
        weapon.mechanicalEffect.toLowerCase().includes('sheds dim light') ||
        weapon.mechanicalEffect.toLowerCase().includes('undead')
    ) {
        high -= 25;
    }

    low = Math.max(low, weapon.rarity === 'Common' ? 50 : 101);
    high = Math.max(high, low + 25);

    return {
        low,
        high,
        display: `${low}-${high} gp`,
    };
}