import { useMemo, useRef, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { WeaponGeneratorForm } from '../components/form/WeaponGeneratorForm';
import { WeaponCard } from '../components/output/WeaponCard';
import { DMNotesPanel } from '../components/output/DMNotesPanel';
import { ExportCardButton } from '../components/output/ExportCardButton';
import { isAiGenerationConfigured } from '../ai/weaponAiClient';
import { buildWeapon } from '../features/weapon-generator/logic/buildWeapon';
import { buildAiWeapon } from '../features/weapon-generator/logic/buildAiWeapon';
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
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const cardRef = useRef<HTMLElement | null>(null);
  const aiGenerationAvailable = isAiGenerationConfigured();

  const canRegenerate = useMemo(() => {
    return formValue.theme.trim().length > 0;
  }, [formValue.theme]);

  async function generateWeapon() {
    setIsGenerating(true);
    setGenerationError('');

    try {
      if (aiAssistEnabled && aiGenerationAvailable) {
        const result = await buildAiWeapon(formValue);
        setGeneratedResult(result);
        return;
      }

      const result = buildWeapon(formValue);
      setGeneratedResult(result);
    } catch (error) {
      const fallbackResult = buildWeapon(formValue);
      const message =
        error instanceof Error ? error.message : 'AI generation failed.';

      setGeneratedResult({
        ...fallbackResult,
        source: 'hybrid',
        warnings: [
          ...fallbackResult.warnings,
          `AI generation failed, so rules generation was used instead. ${message}`,
        ],
      });
      setGenerationError(`AI generation failed. Rules fallback used. ${message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleGenerate() {
    void generateWeapon();
  }

  function handleRegenerate() {
    void generateWeapon();
  }

  function handleReset() {
    setFormValue({ ...defaultWeaponGenerationInput });
    setGeneratedResult(null);
    setGenerationError('');
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
            aiAssistEnabled={aiAssistEnabled}
            aiGenerationAvailable={aiGenerationAvailable}
            isGenerating={isGenerating}
            generationError={generationError}
            onAiAssistChange={setAiAssistEnabled}
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
