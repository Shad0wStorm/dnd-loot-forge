import type {
    MagicalDamageType,
    Rarity,
    Tag,
    WeaponCategory,
    WeaponForm,
} from '../model/weapon.types';

export interface WeaponEffectTemplate {
    id: string;
    allowedRarities: Rarity[];
    allowedCategories: WeaponCategory[];
    allowedForms?: WeaponForm[];
    magicalThemes: MagicalDamageType[];
    tags: Tag[];
    mechanicalEffect: string;
    damageEffectNotes: string;
    flavourPattern: string;
    balanceNote: string;
}

export const weaponEffectTemplates: WeaponEffectTemplate[] =[
      {
    id: 'ember-nick',
    allowedRarities: ['Common', 'Uncommon'],
    allowedCategories: ['Melee', 'Ranged', 'Adaptive'],
    magicalThemes: ['Fire'],
    tags: ['Elemental'],
    mechanicalEffect:
      'Once per turn, when this weapon hits, it deals an extra 1 fire damage.',
    damageEffectNotes:
      'The extra damage is intentionally small and remains suitable for low-tier play.',
    flavourPattern:
      'Its edge carries a steady ember-glow, as though it remembers an old forge-fire.',
    balanceNote:
      'Minor damage rider only. Safe for common-to-uncommon play.',
  },
  {
    id: 'frost-mark',
    allowedRarities: ['Uncommon'],
    allowedCategories: ['Melee', 'Ranged', 'Adaptive'],
    magicalThemes: ['Cold'],
    tags: ['Elemental', 'Hunter'],
    mechanicalEffect:
      'The first creature you hit with this weapon on your turn has its speed reduced by 5 feet until the start of your next turn.',
    damageEffectNotes:
      'This does not stack meaningfully and is a soft control effect, not a lockdown tool.',
    flavourPattern:
      'Pale rime blooms along the weapon for a heartbeat after every strike.',
    balanceNote:
      'Mild battlefield control. Appropriate for uncommon items.',
  },
  {
    id: 'storm-spark',
    allowedRarities: ['Uncommon'],
    allowedCategories: ['Melee', 'Ranged', 'Adaptive'],
    magicalThemes: ['Lightning', 'Thunder'],
    tags: ['Elemental'],
    mechanicalEffect:
      'Once per long rest, after you hit with this weapon, you can cause the strike to crack with energy, dealing an extra 1d4 lightning or thunder damage.',
    damageEffectNotes:
      'Single-use burst keeps the item punchy without pushing into rare-tier output.',
    flavourPattern:
      'A charge builds in the air around it, raising hairs and humming in the grip.',
    balanceNote:
      'Limited-use burst. Kept intentionally modest.',
  },
  {
    id: 'warding-light',
    allowedRarities: ['Common', 'Uncommon'],
    allowedCategories: ['Melee', 'Caster', 'Adaptive'],
    magicalThemes: ['Radiant', 'Arcane'],
    tags: ['Divine', 'Blessed', 'Guardian'],
    mechanicalEffect:
      'This weapon sheds dim light in a 10-foot radius on command. While the light is active, you have advantage on checks made to notice desecrated objects or spaces.',
    damageEffectNotes:
      'Utility-forward effect with niche investigative value.',
    flavourPattern:
      'Soft gold-white light leaks from faint lines etched into its surface.',
    balanceNote:
      'Mostly utility. Very safe for common and uncommon use.',
  },
  {
    id: 'grave-warning',
    allowedRarities: ['Common', 'Uncommon'],
    allowedCategories: ['Melee', 'Caster', 'Adaptive'],
    magicalThemes: ['Necrotic', 'Psychic'],
    tags: ['Shadow', 'Cursed'],
    mechanicalEffect:
      'When undead come within 30 feet of you, this weapon becomes cool to the touch and emits a faint whisper only you can hear.',
    damageEffectNotes:
      'No direct combat increase. Narrative warning utility only.',
    flavourPattern:
      'It feels most awake in places where the air is still and wrong.',
    balanceNote:
      'Purely narrative utility. Very safe for low rarity.',
  },
  {
    id: 'hunters-thread',
    allowedRarities: ['Uncommon'],
    allowedCategories: ['Ranged', 'Melee', 'Adaptive'],
    magicalThemes: ['Arcane', 'Psychic'],
    tags: ['Hunter'],
    mechanicalEffect:
      'Once per long rest, when you hit a creature with this weapon, you learn whether it is currently below half its hit points.',
    damageEffectNotes:
      'Information effect only; useful, but not swingy.',
    flavourPattern:
      'The weapon seems to tug subtly toward wounded prey.',
    balanceNote:
      'Tactical information is useful without inflating raw power.',
  },
  {
    id: 'guildhand-shift',
    allowedRarities: ['Uncommon'],
    allowedCategories: ['Adaptive'],
    magicalThemes: ['Arcane', 'Force'],
    tags: ['Guild', 'Adaptive'],
    mechanicalEffect:
      'At the end of a long rest, you can reshape this item into another chosen weapon form from its adaptive set. Its magical effect remains the same.',
    damageEffectNotes:
      'Adaptive utility is the main value. No added combat scaling beyond form flexibility.',
    flavourPattern:
      'The weapon’s surface shifts like set metal recalling another purpose.',
    balanceNote:
      'Versatility is strong, so the effect budget stays otherwise restrained.',
  },
  {
    id: 'echo-strike',
    allowedRarities: ['Uncommon'],
    allowedCategories: ['Melee', 'Caster', 'Adaptive'],
    magicalThemes: ['Thunder', 'Psychic'],
    tags: ['Fortune'],
    mechanicalEffect:
      'Once per long rest, when you miss with this weapon, you can create a resonant echo and gain a +1 bonus to the next attack roll you make with it before the end of your next turn.',
    damageEffectNotes:
      'Miss-recovery only. Does not create extra attacks or immediate rerolls.',
    flavourPattern:
      'A fading aftersound trails behind every committed swing.',
    balanceNote:
      'A mild correction mechanic, not an action-economy break.',
  },
]