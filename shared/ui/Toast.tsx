'use client';

import { useEffect } from 'react';

type Props = {
  kind: 'ok' | 'error';
  text: string;
  onClose: () => void;
  duration?: number;
};

export function Toast({ kind, text, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto rounded px-4 py-2 text-white shadow ${
        kind === 'ok' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {text}
    </div>
  );
}
