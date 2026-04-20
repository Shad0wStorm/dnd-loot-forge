import { forwardRef } from 'react';
import type {
  GeneratorResult,
  GeneratedWeapon,
} from '../../features/weapon-generator/model/weapon.types';

interface WeaponCardProps {
  result: GeneratorResult<GeneratedWeapon> | null;
}

export const WeaponCard = forwardRef<HTMLElement, WeaponCardProps>(
  function WeaponCard({ result }, ref) {
    if (!result) {
      return (
        <article ref={ref} className="item-card item-card--empty">
          <div className="item-card__empty-inner">
            <p className="item-card__empty-title">No item generated yet</p>
            <p className="item-card__empty-text">
              Fill in the form and forge a magic weapon.
            </p>
          </div>
        </article>
      );
    }

    const weapon = result.content;
    const baseLine = weapon.damageEffectNotes.split('.')[0];

    return (
      <article
        ref={ref}
        className={`item-card item-card--${weapon.rarity.toLowerCase()}`}
      >
        <div className="item-card__frame">
          <div className="item-card__ornament" aria-hidden="true" />

          <header className="item-card__header">
            <p className="item-card__type-line">Magic Weapon</p>
            <h3 className="item-card__title">{weapon.name}</h3>
            <div className="item-card__meta">
              <span className="item-rarity-badge">{weapon.rarity}</span>
              <span>{weapon.form}</span>
              <span>{weapon.magicalTheme}</span>
            </div>
          </header>

          <section className="item-card__rules">
            <p className="item-card__section-label">Property</p>
            <p className="item-card__rules-text">{weapon.mechanicalEffect}</p>
          </section>

          <section className="item-card__lore">
            <p className="item-card__section-label">Lore</p>
            <p className="item-card__lore-text">“{weapon.flavourText}”</p>
          </section>

          <section className="item-card__stats">
            <div className="item-stat">
              <span className="item-stat__label">Base</span>
              <span className="item-stat__value">{baseLine}</span>
            </div>

            <div className="item-stat">
              <span className="item-stat__label">Category</span>
              <span className="item-stat__value">{weapon.category}</span>
            </div>

            <div className="item-stat">
              <span className="item-stat__label">Theme</span>
              <span className="item-stat__value">{weapon.magicalTheme}</span>
            </div>
          </section>

          <section className="item-card__tags">
            {weapon.tags.map((tag) => (
              <span key={tag} className="item-tag">
                {tag}
              </span>
            ))}
          </section>

          {weapon.adaptiveForms?.length ? (
            <section className="item-card__adaptive">
              <p className="item-card__section-label">Adaptive Forms</p>
              <ul className="item-card__adaptive-list">
                {weapon.adaptiveForms.map((formProfile) => (
                  <li key={formProfile.form}>
                    <strong>{formProfile.form}</strong> —{' '}
                    {formProfile.baseDamageDice} {formProfile.baseDamageType}
                    {formProfile.range ? ` • ${formProfile.range}` : ''}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
    );
  },
);