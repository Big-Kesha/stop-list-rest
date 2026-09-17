'use client';

import { useEffect } from 'react';

type Props = {
  kind: 'ok' | 'error';
  text: string;
  onClose: () => void;
};

export function Toast({ kind, text, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 rounded px-4 py-2 text-white shadow ${
        kind === 'ok' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {text}
    </div>
  );
}
