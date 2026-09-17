'use client';

import { SHOP_LABELS, STOP_REASON_LABELS, type MenuItem } from '@/types/menu';

type Props = {
  items: MenuItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onStopClick: (id: string) => void;
  onResumeClick: (id: string) => void;
};

export function StopListTable({
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onStopClick,
  onResumeClick,
}: Props) {
  // переписать стэйты загрузки и ошибки, чтобы ui не скакал
  if (isLoading) return <div className="text-gray-500">Загрузка…</div>;

  if (isError) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4">
        <p className="mb-2 text-red-700">Ошибка: {errorMessage}</p>
        <button
          onClick={onRetry}
          className="rounded bg-red-600 px-3 py-1 text-white"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-gray-500">Ничего не найдено</div>;
  }

  return (
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
        {items.map((item) => (
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
                  onClick={() => onStopClick(item.id)}
                  className="rounded border px-2 py-1"
                >
                  В стоп
                </button>
              ) : (
                <button
                  onClick={() => onResumeClick(item.id)}
                  className="rounded border px-2 py-1"
                >
                  Снять
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
