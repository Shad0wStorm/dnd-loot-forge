import type {
  GeneratedWeapon,
  GeneratorResult,
} from '../../features/weapon-generator/model/weapon.types';

interface DMNotesPanelProps {
  result: GeneratorResult<GeneratedWeapon> | null;
}

export function DMNotesPanel({ result }: DMNotesPanelProps) {
  if (!result) {
    return null;
  }

  const weapon = result.content;

  return (
    <section className="dm-notes-panel">
      <div className="dm-notes-panel__header">
        <h4>DM Notes</h4>
        <p>Prep-facing details and balance context.</p>
      </div>

      <div className="dm-notes-panel__grid">
        <div className="dm-note-block">
          <h5>Estimated Value</h5>
          <p>{weapon.estimatedGoldValue.display}</p>
        </div>

        <div className="dm-note-block">
          <h5>Balance Note</h5>
          <p>{weapon.balanceNote}</p>
        </div>

        <div className="dm-note-block">
          <h5>Damage / Effect Notes</h5>
          <p>{weapon.damageEffectNotes}</p>
        </div>

        <div className="dm-note-block">
          <h5>Source</h5>
          <p>{result.source}</p>
        </div>

        <div className="dm-note-block">
          <h5>Warnings</h5>
          {result.warnings.length ? (
            <ul>
              {result.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : (
            <p>No balance warnings flagged.</p>
          )}
        </div>
      </div>
    </section>
  );
}