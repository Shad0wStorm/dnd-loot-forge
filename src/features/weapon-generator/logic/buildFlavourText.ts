interface BuildFlavourTextOptions {
  theme: string;
  deityTag: string;
  alignmentTag: string;
  flavourPattern: string;
}

export function buildFlavourText({
  theme,
  deityTag,
  alignmentTag,
  flavourPattern,
}: BuildFlavourTextOptions): string {
  const parts: string[] = [];

  if (theme.trim()) {
    parts.push(`Forged in the style of ${theme.trim().toLowerCase()}`);
  }

  if (deityTag.trim()) {
    parts.push(`and marked by the influence of ${deityTag.trim()}`);
  } else if (alignmentTag.trim()) {
    parts.push(`and tied to a ${alignmentTag.trim().toLowerCase()} ideal`);
  }

  const intro = parts.length > 0 ? `${parts.join(' ')}.` : '';

  return `${intro} ${flavourPattern}`.trim();
}