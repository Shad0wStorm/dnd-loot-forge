import { useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { WeaponGeneratorForm } from '../components/form/WeaponGeneratorForm';
import { WeaponCard } from '../components/output/WeaponCard';
import { buildWeapon } from '../features/weapon-generator/logic/buildWeapon';
import {
  defaultWeaponGenerationInput,
  type GeneratedWeapon,
  type GeneratorResult,
  type WeaponGenerationInput,
} from '../features/weapon-generator/model';


export default function App() {
  const [formValue, setFormValue] = useState<WeaponGenerationInput>({
    ...defaultWeaponGenerationInput,
  });

  const [generatedResult, setGeneratedResult] = useState<
    GeneratorResult<GeneratedWeapon> | null
  >(null);

  const canRegenerate = useMemo(() => {
    return formValue.theme.trim().length > 0;
  }, [formValue.theme]);

  function handleGenerate() {
    const result = buildWeapon(formValue);
    setGeneratedResult(result);
  }

  function handleRegenerate() {
    const result = buildWeapon(formValue);
    setGeneratedResult(result);
  }

  function handleReset() {
    setFormValue({ ...defaultWeaponGenerationInput });
    setGeneratedResult(null);
  }

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
          <WeaponGeneratorForm
            value={formValue}
            onChange={setFormValue}
            onGenerate={handleGenerate}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            canRegenerate={canRegenerate}
            />
        </SectionCard>

        <SectionCard title="Generated Weapon">
          <WeaponCard result={generatedResult}/>
        </SectionCard>
      </div>
      
    </AppShell>
  );
}