'use client';

import { Toast } from './Toast';
import type { Toast as ToastItem } from '@/features/stop-list/model/ui-store';

type Props = {
  toasts: ToastItem[];
  onClose: (id: number) => void;
};

export function ToastContainer({ toasts, onClose }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          kind={t.kind}
          text={t.text}
          onClose={() => onClose(t.id)}
        />
      ))}
    </div>
  );
}
