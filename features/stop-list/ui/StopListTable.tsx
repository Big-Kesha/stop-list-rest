'use client';

import { Table, THead, TBody, TR, TH, TD } from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ShopBadge } from './ShopBadge';
import {
  STOP_REASON_LABELS,
  type MenuItem,
  type StopReason,
} from '@/types/menu';

type Props = {
  items: MenuItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  isItemPending: (id: string) => boolean;
  onStopClick: (id: string) => void;
  onResumeClick: (id: string) => void;
};

export function StopListTable({
  items,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onRetry,
  isItemPending,
  onStopClick,
  onResumeClick,
}: Props) {
  const showErrorRow = isError && items.length === 0;
  const showData = items.length > 0;
  const isRefetching = isFetching && !isLoading;

  return (
    <div className="relative">
      {isRefetching && (
        <div className="absolute right-2 top-2 z-10 text-xs text-ink-subtle">
          обновление…
        </div>
      )}

      <Table
        className={`min-w-225 ${isRefetching ? 'opacity-70 transition-opacity' : ''}`}
      >
        <THead>
          <TR>
            <TH>Название</TH>
            <TH>Цех</TH>
            <TH className="w-24 text-right">Остаток</TH>
            <TH className="w-40">Статус</TH>
            <TH>Причина / до</TH>
            <TH className="w-44" />
          </TR>
        </THead>
        <TBody>
          {isLoading ? (
            <PlaceholderRow colSpan={6} text="Загрузка…" />
          ) : showErrorRow ? (
            <ErrorRow colSpan={6} message={errorMessage} onRetry={onRetry} />
          ) : showData ? (
            items.map((item) => (
              <StopItemRow
                key={item.id}
                item={item}
                isPending={isItemPending(item.id)}
                onStopClick={onStopClick}
                onResumeClick={onResumeClick}
              />
            ))
          ) : (
            <PlaceholderRow colSpan={6} text="Ничего не найдено" />
          )}
        </TBody>
      </Table>
    </div>
  );
}

function PlaceholderRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-3 py-8 text-center text-sm text-ink-muted"
      >
        {text}
      </td>
    </tr>
  );
}

function ErrorRow({
  colSpan,
  message,
  onRetry,
}: {
  colSpan: number;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-8 text-center">
        <p className="mb-3 text-sm text-red-700">
          {message ?? 'Не удалось загрузить меню'}
        </p>
        <Button size="sm" variant="danger" onClick={onRetry}>
          Повторить
        </Button>
      </td>
    </tr>
  );
}

function StopItemRow({
  item,
  isPending,
  onStopClick,
  onResumeClick,
}: {
  item: MenuItem;
  isPending: boolean;
  onStopClick: (id: string) => void;
  onResumeClick: (id: string) => void;
}) {
  const isStopped = item.status.kind === 'stopped';

  return (
    <TR className={isStopped ? 'bg-bg/40' : ''}>
      <TD className="font-medium text-ink">{item.title}</TD>
      <TD>
        <ShopBadge shop={item.shop} />
      </TD>
      <TD className="text-right tabular-nums text-ink-muted">{item.stock}</TD>
      <TD>
        {isStopped ? (
          <Badge tone="danger">В стоп-листе</Badge>
        ) : (
          <Badge tone="success">В продаже</Badge>
        )}
      </TD>
      <TD className="text-ink-muted">
        {item.status.kind === 'stopped' ? (
          <StopDetails reason={item.status.reason} until={item.status.until} />
        ) : (
          '—'
        )}
      </TD>
      <TD className="text-right">
        {isStopped ? (
          <Button
            size="sm"
            variant="secondary"
            isLoading={isPending}
            loadingText="Возвращаем…"
            onClick={() => onResumeClick(item.id)}
          >
            Вернуть в продажу
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            isLoading={isPending}
            loadingText="Сохраняется…"
            onClick={() => onStopClick(item.id)}
          >
            В стоп
          </Button>
        )}
      </TD>
    </TR>
  );
}

function StopDetails({
  reason,
  until,
}: {
  reason: StopReason;
  until: string | null;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <Badge tone="neutral">{STOP_REASON_LABELS[reason]}</Badge>
      <span className="text-xs text-ink-subtle">
        {until
          ? `до ${new Date(until).toLocaleString('ru-RU')}`
          : 'до конца смены'}
      </span>
    </span>
  );
}
