'use client';

import { useState } from 'react';
import {
  ALL_REASONS,
  STOP_REASON_LABELS,
  type MenuItem,
  type StopItemPayload,
  type StopReason,
} from '@/types/menu';

type Props = {
  item: MenuItem;
  onCancel: () => void;
  onSubmit: (payload: StopItemPayload) => void;
  isPending: boolean;
};

export function StopReasonPanel({
  item,
  onCancel,
  onSubmit,
  isPending,
}: Props) {
  const [reason, setReason] = useState<StopReason>('out_of_stock');
  const [mode, setMode] = useState<'shift' | 'time'>('shift');
  const [time, setTime] = useState('');

  const submit = () => {
    let until: string | null = null;
    if (mode === 'time') {
      if (!time) return;
      until = new Date(time).toISOString();
    }
    onSubmit({ reason, until });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-lg font-medium">
          В стоп: <span className="text-gray-700">{item.title}</span>
        </h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-gray-600">Причина</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as StopReason)}
            className="w-full rounded border px-2 py-1"
          >
            {ALL_REASONS.map((r) => (
              <option key={r} value={r}>
                {STOP_REASON_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-4">
          <span className="mb-1 block text-sm text-gray-600">Срок</span>
          <label className="mr-4">
            <input
              type="radio"
              checked={mode === 'shift'}
              onChange={() => setMode('shift')}
            />{' '}
            До конца смены
          </label>
          <label>
            <input
              type="radio"
              checked={mode === 'time'}
              onChange={() => setMode('time')}
            />{' '}
            Конкретное время
          </label>
          {mode === 'time' && (
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-2 w-full rounded border px-2 py-1"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={isPending}
            className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-50"
          >
            {isPending ? 'Отправка…' : 'Поставить'}
          </button>
        </div>
      </div>
    </div>
  );
}
