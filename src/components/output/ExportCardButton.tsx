import { toPng } from 'html-to-image';
import type { RefObject } from 'react';

interface ExportCardButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  fileName: string;
  disabled?: boolean;
}

export function ExportCardButton({
  targetRef,
  fileName,
  disabled = false,
}: ExportCardButtonProps) {
  async function handleExport() {
    if (!targetRef.current) {
      return;
    }

    try {
      const node = targetRef.current;
      const rect = node.getBoundingClientRect();

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#120f0c',
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
        style: {
          margin: '0',
          transform: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export item card as PNG:', error);
    }
  }

  return (
    <button type="button" onClick={handleExport} disabled={disabled}>
      Save Card as PNG
    </button>
  );
}