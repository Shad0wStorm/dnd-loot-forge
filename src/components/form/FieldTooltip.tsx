interface FieldTooltipProps {
  text: string;
}

export function FieldTooltip({ text }: FieldTooltipProps) {
  return (
    <span className="field-tooltip" tabIndex={0} aria-label={text}>
      ?
      <span className="field-tooltip__bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}