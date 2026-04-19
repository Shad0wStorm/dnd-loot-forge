import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { 
  defaultWeaponGenerationInput,
  type WeaponGenerationInput,
 } from '../features/weapon-generator/model';
import { buildWeapon } from '../features/weapon-generator/logic/buildWeapon';

const demoInput: WeaponGenerationInput = {
  ...defaultWeaponGenerationInput,
  theme: ' Guild relic craftsmanship',
  magicalTheme: 'Fire',
  weaponCategory: 'Melee',
  rarity: 'Uncommon',
  adaptiveFormEnabled: true,
  deityTag: 'The Forge Saint',
};

const generated = buildWeapon(demoInput);

export default function App() {
  return (
    <AppShell>
      <PageHeader
        title="D&D Loot Forge"
        subtitle="A tool to generate random loot for Dungeons & Dragons 5th Edition."
      />
      <div className="app-header">
        <SectionCard title="Loot Generator">
          <p>
            Generate random loot based on the rules and tables from the Dungeons & Dragons 5th Edition
            Dungeon Master's Guide. Customize the loot by selecting the desired challenge rating and
            treasure type.
          </p>
        </SectionCard>
      </div>
      <div className="app-grid">
        <SectionCard title="Generator Inputs">
          <pre>{JSON.stringify(demoInput, null, 2)}</pre>
        </SectionCard>

        <SectionCard title="Generated Weapon">
          <pre>{JSON.stringify(generated, null, 2)}</pre>
        </SectionCard>
      </div>
      
    </AppShell>
  );
}