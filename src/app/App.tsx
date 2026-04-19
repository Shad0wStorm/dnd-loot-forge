import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';

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
          <p>Weapon generator form will go here.</p>
        </SectionCard>

        <SectionCard title="Generated Weapon">
          <p>Generated magic weapon output will appear here.</p>
        </SectionCard>
      </div>
      
    </AppShell>
  );
}