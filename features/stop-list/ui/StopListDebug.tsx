'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ALL_REASONS,
  SHOP_LABELS,
  STOP_REASON_LABELS,
  type MenuItem,
  type Shop,
  type StopItemPayload,
  type StopReason,
} from '@/types/menu';

type ShopFilter = Shop | 'all';
type StatusFilter = 'all' | 'available' | 'stopped';

const SHOPS: Shop[] = ['kitchen', 'bar', 'pastry'];

export function StopListDebug() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [shop, setShop] = useState<ShopFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const [stopTargetId, setStopTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/menu-items');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setItems(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Автоскрытие тоста
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (shop !== 'all' && i.shop !== shop) return false;
      if (status !== 'all' && i.status.kind !== status) return false;
      return true;
    });
  }, [items, shop, status]);

  // --- мутации (пока без оптимистики, чтобы видеть реальное поведение) ---

  const stop = async (id: string, payload: StopItemPayload) => {
    const res = await fetch(`/api/menu-items/${id}/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }
    return (await res.json()) as MenuItem;
  };

  const resume = async (id: string) => {
    const res = await fetch(`/api/menu-items/${id}/resume`, { method: 'POST' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }
    return (await res.json()) as MenuItem;
  };

  const handleStop = async (id: string, payload: StopItemPayload) => {
    try {
      const updated = await stop(id, payload);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setStopTargetId(null);
      setToast({ kind: 'ok', text: 'Поставлено в стоп' });
    } catch (e) {
      setToast({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Ошибка',
      });
    }
  };

  const handleResume = async (id: string) => {
    try {
      const updated = await resume(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setToast({ kind: 'ok', text: 'Снято со стопа' });
    } catch (e) {
      setToast({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Ошибка',
      });
    }
  };

  // --- рендер ---

  if (isLoading) {
    return <div className="text-gray-500">Загрузка меню…</div>;
  }

  if (error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4">
        <p className="mb-2 text-red-700">Ошибка: {error}</p>
        <button
          onClick={load}
          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-gray-500">Меню пустое</div>;
  }

  const stopTarget = items.find((i) => i.id === stopTargetId) ?? null;

  return (
    <>
      {/* Фильтры */}
      <div className="mb-4 flex gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Цех:</span>
          <select
            value={shop}
            onChange={(e) => setShop(e.target.value as ShopFilter)}
            className="rounded border px-2 py-1"
          >
            <option value="all">Все</option>
            {SHOPS.map((s) => (
              <option key={s} value={s}>
                {SHOP_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Статус:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded border px-2 py-1"
          >
            <option value="all">Все</option>
            <option value="available">В продаже</option>
            <option value="stopped">В стоп-листе</option>
          </select>
        </label>

        <button
          onClick={load}
          className="ml-auto rounded border px-3 py-1 hover:bg-gray-50"
        >
          Обновить
        </button>
      </div>

      {/* Таблица */}
      {filtered.length === 0 ? (
        <div className="text-gray-500">Ничего не найдено по фильтрам</div>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-2">Название</th>
              <th className="py-2">Цех</th>
              <th className="py-2">Остаток</th>
              <th className="py-2">Статус</th>
              <th className="py-2">Причина / до</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.title}</td>
                <td className="py-2">{SHOP_LABELS[item.shop]}</td>
                <td className="py-2">{item.stock}</td>
                <td className="py-2">
                  {item.status.kind === 'available' ? (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">
                      В продаже
                    </span>
                  ) : (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-red-800">
                      В стоп-листе
                    </span>
                  )}
                </td>
                <td className="py-2 text-gray-600">
                  {item.status.kind === 'stopped' ? (
                    <>
                      {STOP_REASON_LABELS[item.status.reason]}
                      {' · '}
                      {item.status.until
                        ? new Date(item.status.until).toLocaleString('ru-RU')
                        : 'до конца смены'}
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-2 text-right">
                  {item.status.kind === 'available' ? (
                    <button
                      onClick={() => setStopTargetId(item.id)}
                      className="rounded border px-2 py-1 hover:bg-gray-50"
                    >
                      В стоп
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResume(item.id)}
                      className="rounded border px-2 py-1 hover:bg-gray-50"
                    >
                      Снять
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Панель стопа */}
      {stopTarget && (
        <StopPanel
          item={stopTarget}
          onCancel={() => setStopTargetId(null)}
          onSubmit={(payload) => handleStop(stopTarget.id, payload)}
        />
      )}

      {/* Тост */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 rounded px-4 py-2 text-white shadow ${
            toast.kind === 'ok' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}

// --- панель стопа: минимальная форма ---

function StopPanel({
  item,
  onCancel,
  onSubmit,
}: {
  item: MenuItem;
  onCancel: () => void;
  onSubmit: (payload: StopItemPayload) => void;
}) {
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
            className="rounded border px-3 py-1 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            Поставить
          </button>
        </div>
      </div>
    </div>
  );
}
