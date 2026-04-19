import type { MagicalDamageType, Tag } from '../model/weapon.types';

export const namePrefixesByTheme: Record<MagicalDamageType, string[]> = {
  Arcane: ['Spell', 'Rune', 'Aether', 'Sigil', 'Veil'],
  Fire: ['Ember', 'Ash', 'Cinder', 'Flame', 'Pyre'],
  Cold: ['Frost', 'Rime', 'Glacier', 'Winter', 'Ice'],
  Lightning: ['Storm', 'Spark', 'Volt', 'Thunder', 'Tempest'],
  Thunder: ['Echo', 'Peal', 'Drum', 'Crash', 'Resonance'],
  Radiant: ['Dawn', 'Sun', 'Halo', 'Lumen', 'Grace'],
  Necrotic: ['Grave', 'Dusk', 'Pall', 'Mourn', 'Shade'],
  Force: ['Pulse', 'Shard', 'Impact', 'Drive', 'Kinetic'],
  Psychic: ['Whisper', 'Dream', 'Mind', 'Thought', 'Echo'],
  Poison: ['Venom', 'Viper', 'Fang', 'Toxin', 'Adder'],
};

export const neutralSuffixes = [
  'Brand',
  'Edge',
  'Mark',
  'Reach',
  'Song',
  'Touch',
  'Guard',
  'Whisper',
  'Bite',
  'Ward',
];

export const tagSuffixes: Partial<Record<Tag, string[]>> = {
  Divine: ['of the Sacred Path', 'of Mercy', 'of Oaths'],
  Shadow: ['of Dusk', 'of the Veil', 'of Hidden Steps'],
  Elemental: ['of the First Flame', 'of Winter Air', 'of the Stormwake'],
  Hunter: ['of the Trail', 'of the Keen Eye', 'of the Last Pursuit'],
  Guardian: ['of the Hearth', 'of the Wall', 'of the Last Watch'],
  Fortune: ['of the Lucky Star', 'of Turning Chance', 'of the Third Toss'],
  Guild: ['of the Guildhand', 'of the Contract', 'of the Brass Seal'],
  Adaptive: ['of Many Shapes', 'of the Changing Hand', 'of the Ready Grip'],
  Blessed: ['of Quiet Grace', 'of Benediction', 'of the Kindly Hand'],
  Cursed: ['of the Hollow Vow', 'of Bitter Debt', 'of the Unquiet Mark'],
};