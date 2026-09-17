'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
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

const STEP_MS = 15 * 60 * 1000;
const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MINUTES = 15;

function validateUntil(value: string, now = Date.now()): string | null {
  if (!value) return 'Укажите время';

  const date = new Date(value);
  const ts = date.getTime();
  if (Number.isNaN(ts)) return 'Некорректное время';

  if (
    date.getMinutes() % STEP_MINUTES !== 0 ||
    date.getSeconds() !== 0 ||
    date.getMilliseconds() !== 0
  ) {
    return 'Шаг — 15 минут (например, 10:00, 10:15, 10:30)';
  }

  if (ts <= now) return 'Время должно быть в будущем';

  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';

  return null;
}

export function StopReasonPanel({
  item,
  onCancel,
  onSubmit,
  isPending,
}: Props) {
  const [reason, setReason] = useState<StopReason>('out_of_stock');
  const [mode, setMode] = useState<'shift' | 'time'>('shift');
  const [time, setTime] = useState('');
  const [timeError, setTimeError] = useState<string | null>(null);

  const submit = () => {
    let until: string | null = null;
    if (mode === 'time') {
      const err = validateUntil(time);
      if (err) {
        setTimeError(err);
        return;
      }
      until = new Date(time).toISOString();
    }
    onSubmit({ reason, until });
  };

  // TODO компоненты
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded-md bg-white p-5 shadow-lg">
        <h2 className="mb-4 text-lg font-medium text-ink">
          В стоп: <span className="text-ink-muted">{item.title}</span>
        </h2>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-ink-muted">Причина</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as StopReason)}
            className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {ALL_REASONS.map((r) => (
              <option key={r} value={r}>
                {STOP_REASON_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-5">
          <span className="mb-1 block text-sm text-ink-muted">Срок</span>
          <label className="mr-4 inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={mode === 'shift'}
              onChange={() => {
                setMode('shift');
                setTimeError(null);
              }}
            />
            До конца смены
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={mode === 'time'}
              onChange={() => setMode('time')}
            />
            Конкретное время
          </label>

          {mode === 'time' && (
            <div className="mt-2">
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setTimeError(null);
                }}
                aria-invalid={!!timeError}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-ink focus:outline-none ${
                  timeError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-line focus:border-accent'
                }`}
              />
              {timeError && (
                <p className="mt-1 text-xs text-red-600">{timeError}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            isLoading={isPending}
            loadingText="Отправка…"
          >
            Поставить
          </Button>
        </div>
      </div>
    </div>
  );
}
