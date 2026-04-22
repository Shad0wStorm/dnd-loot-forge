import { useEffect, type ChangeEvent, type FormEvent } from 'react';
import { weaponGenerationInputSchema } from '../../features/weapon-generator/model/weapon.schemas';
import type { WeaponGenerationInput } from '../../features/weapon-generator/model/weapon.types';
import {
  magicalThemeOptions,
  rarityOptions,
  weaponCategoryOptions,
} from '../../features/weapon-generator/data/formOptions';
import {
  getAllowedFormsForCategory,
  isFormAllowedForCategory,
} from '../../features/weapon-generator/utils/formFilters';
import { FieldTooltip } from './FieldTooltip';

interface WeaponGeneratorFormProps {
  value: WeaponGenerationInput;
  onChange: (nextValue: WeaponGenerationInput) => void;
  onGenerate: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  canRegenerate: boolean;
}

export function WeaponGeneratorForm({
  value,
  onChange,
  onGenerate,
  onReset,
  onRegenerate,
  canRegenerate,
}: WeaponGeneratorFormProps) {
  const validation = weaponGenerationInputSchema.safeParse(value);

  const fieldErrors = validation.success
    ? {}
    : validation.error.flatten().fieldErrors;

  const allowedForms = getAllowedFormsForCategory(value.weaponCategory);

  useEffect(() => {
    if (!isFormAllowedForCategory(value.weaponCategory, value.preferredForm)) {
      onChange({
        ...value,
        preferredForm: '',
      });
    }
  }, [value, onChange]);

  function updateField<K extends keyof WeaponGenerationInput>(
    key: K,
    fieldValue: WeaponGenerationInput[K],
  ) {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  }

  function handleTextChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value: nextValue } = event.target;
    updateField(name as keyof WeaponGenerationInput, nextValue as never);
  }

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value: nextValue } = event.target;
    updateField(name as keyof WeaponGenerationInput, nextValue as never);
  }

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    updateField(name as keyof WeaponGenerationInput, checked as never);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validation.success) {
      return;
    }

    onGenerate();
  }

  const showCustomName = value.nameMode === 'custom';

  return (
    <form className="generator-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="nameMode">Name Mode</label>
        <select
          id="nameMode"
          name="nameMode"
          value={value.nameMode}
          onChange={handleSelectChange}
        >
          <option value="random">Random</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {showCustomName ? (
        <div className="form-row">
          <label htmlFor="customName">Custom Name</label>
          <input
            id="customName"
            name="customName"
            type="text"
            value={value.customName}
            onChange={handleTextChange}
            placeholder="e.g. Emberwake Pike"
          />
          {fieldErrors.customName?.[0] ? (
            <p className="field-error">{fieldErrors.customName[0]}</p>
          ) : null}
        </div>
      ) : null}

      <div className="form-row">
        <label htmlFor="weaponCategory">Weapon Category</label>
        <select
          id="weaponCategory"
          name="weaponCategory"
          value={value.weaponCategory}
          onChange={handleSelectChange}
        >
          {weaponCategoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="preferredForm">Preferred Form</label>
        <select
          id="preferredForm"
          name="preferredForm"
          value={value.preferredForm}
          onChange={handleSelectChange}
        >
          <option value="">Random valid form</option>
          {allowedForms.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="rarity">Rarity</label>
        <select
          id="rarity"
          name="rarity"
          value={value.rarity}
          onChange={handleSelectChange}
        >
          {rarityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="theme" className="label-with-tooltip">
          <span>Theme</span>
          <FieldTooltip text="Broad flavour direction such as forge relic, storm weapon, shrine guardian, or shadow hunter." />
        </label>
        <input
          id="theme"
          name="theme"
          type="text"
          value={value.theme}
          onChange={handleTextChange}
          placeholder="e.g. guild relic craftsmanship"
        />
        {fieldErrors.theme?.[0] ? (
          <p className="field-error">{fieldErrors.theme[0]}</p>
        ) : null}
      </div>

      <div className="form-row">
        <label htmlFor="magicalTheme">Magical Theme</label>
        <select
          id="magicalTheme"
          name="magicalTheme"
          value={value.magicalTheme}
          onChange={handleSelectChange}
        >
          {magicalThemeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="deityTag" className="label-with-tooltip">
          <span>Deity Tag</span>
          <FieldTooltip text="Optional divine influence, patron, saint, or god associated with the item." />
        </label>
        <input
          id="deityTag"
          name="deityTag"
          type="text"
          value={value.deityTag}
          onChange={handleTextChange}
          placeholder="Optional"
        />
        {fieldErrors.deityTag?.[0] ? (
          <p className="field-error">{fieldErrors.deityTag[0]}</p>
        ) : null}
      </div>

      <div className="form-row">
        <label htmlFor="alignmentTag" className="label-with-tooltip">
          <span>Alignment / Theme Tag</span>
          <FieldTooltip text="Optional moral or narrative angle such as lawful, merciful, vengeful, or secretive." />
        </label>
        <input
          id="alignmentTag"
          name="alignmentTag"
          type="text"
          value={value.alignmentTag}
          onChange={handleTextChange}
          placeholder="Optional"
        />
        {fieldErrors.alignmentTag?.[0] ? (
          <p className="field-error">{fieldErrors.alignmentTag[0]}</p>
        ) : null}
      </div>

      <div className="form-row form-row--checkbox">
        <label htmlFor="adaptiveFormEnabled">Adaptive Form Support</label>
        <input
          id="adaptiveFormEnabled"
          name="adaptiveFormEnabled"
          type="checkbox"
          checked={value.adaptiveFormEnabled}
          onChange={handleCheckboxChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="notes" className="label-with-tooltip">
          <span>Generation Notes</span>
          <FieldTooltip text="Optional extra guidance. Good keywords: hunter, guardian, cursed, lucky, stealthy, radiant, defensive, ritual." />
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={value.notes}
          onChange={handleTextChange}
          placeholder="Optional notes or generation guidance"
        />
        {fieldErrors.notes?.[0] ? (
          <p className="field-error">{fieldErrors.notes[0]}</p>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="submit">Generate Weapon</button>
        <button type="button" onClick={onRegenerate} disabled={!canRegenerate}>
          Regenerate
        </button>
        <button type="button" onClick={onReset} className="button-secondary">
          Reset
        </button>
      </div>

      {!validation.success ? (
        <div className="form-validation-summary">
          <p>Fix the highlighted fields before generating.</p>
        </div>
      ) : null}
    </form>
  );
}