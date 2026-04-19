import type { GeneratorResult, GeneratedWeapon } from '../../features/weapon-generator/model';

interface WeaponCardProps {
  result: GeneratorResult<GeneratedWeapon> | null;
}

export function WeaponCard({ result }: WeaponCardProps) {
  if (!result) {
    return (
      <div className="weapon-card weapon-card--empty">
        <p>No weapon generated yet.</p>
        <p>Fill in the form and generate one.</p>
      </div>
    );
  }

  const weapon = result.content;

  return (
    <article className="weapon-card">
      <div className="weapon-card__header">
        <p className="weapon-card__eyebrow">{weapon.rarity} Magic Weapon</p>
        <h3>{weapon.name}</h3>
        <p className="weapon-card__subtitle">
          {weapon.form} • {weapon.magicalTheme} • {weapon.category}
        </p>
      </div>

      <div className="weapon-card__section">
        <h4>Mechanical Effect</h4>
        <p>{weapon.mechanicalEffect}</p>
      </div>

      <div className="weapon-card__section">
        <h4>Damage / Effect Notes</h4>
        <p>{weapon.damageEffectNotes}</p>
      </div>

      <div className="weapon-card__section">
        <h4>Flavour Text</h4>
        <p>{weapon.flavourText}</p>
      </div>

      <div className="weapon-card__section">
        <h4>Tags</h4>
        <div className="tag-list">
          {weapon.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="weapon-card__section">
        <h4>Balance Note</h4>
        <p>{weapon.balanceNote}</p>
      </div>

      {weapon.adaptiveForms?.length ? (
        <div className="weapon-card__section">
          <h4>Adaptive Forms</h4>
          <ul className="adaptive-form-list">
            {weapon.adaptiveForms.map((formProfile) => (
              <li key={formProfile.form}>
                <strong>{formProfile.form}</strong> — {formProfile.baseDamageDice}{' '}
                {formProfile.baseDamageType}
                {formProfile.range ? ` • Range ${formProfile.range}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.warnings.length ? (
        <div className="weapon-card__warnings">
          <h4>Warnings</h4>
          <ul>
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="weapon-card__section weapon-card__section--card-preview">
        <h4>Card-Friendly Layout</h4>
        <div className="card-preview">
          <p className="card-preview__title">{weapon.cardData.title}</p>
          <p className="card-preview__subtitle">{weapon.cardData.subtitle}</p>
          <ul>
            {weapon.cardData.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="card-preview__footer">{weapon.cardData.footer}</p>
        </div>
      </div>
    </article>
  );
}