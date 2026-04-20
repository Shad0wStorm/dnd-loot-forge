import { useMemo, useRef, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { WeaponGeneratorForm } from '../components/form/WeaponGeneratorForm';
import { WeaponCard } from '../components/output/WeaponCard';
import { DMNotesPanel } from '../components/output/DMNotesPanel';
import { ExportCardButton } from '../components/output/ExportCardButton';
import { buildWeapon } from '../features/weapon-generator/logic/buildWeapon';
import { defaultWeaponGenerationInput } from '../features/weapon-generator/model/weapon.defaults';
import type {
  GeneratedWeapon,
  GeneratorResult,
  WeaponGenerationInput,
} from '../features/weapon-generator/model/weapon.types';

export default function App() {
  const [formValue, setFormValue] = useState<WeaponGenerationInput>({
    ...defaultWeaponGenerationInput,
  });

  const [generatedResult, setGeneratedResult] = useState<
    GeneratorResult<GeneratedWeapon> | null
  >(null);

  const cardRef = useRef<HTMLElement | null>(null);

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

  const exportFileName = generatedResult
    ? generatedResult.content.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'dnd-item-card';

  return (
    <AppShell>
      <PageHeader
        title="D&D Loot Forge"
        subtitle="Create custom low-power magic weapons for campaign prep."
      />

      <div className="app-grid">
        <SectionCard title="Forge Settings">
          <WeaponGeneratorForm
            value={formValue}
            onChange={setFormValue}
            onGenerate={handleGenerate}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            canRegenerate={canRegenerate}
          />
        </SectionCard>

        <div className="results-column">
          <SectionCard title="Item Card Preview">
            <div className="card-preview-actions">
              <ExportCardButton
                targetRef={cardRef}
                fileName={exportFileName}
                disabled={!generatedResult}
              />
            </div>

            <WeaponCard ref={cardRef} result={generatedResult} />
          </SectionCard>

          <DMNotesPanel result={generatedResult} />
        </div>
      </div>
    </AppShell>
  );
}