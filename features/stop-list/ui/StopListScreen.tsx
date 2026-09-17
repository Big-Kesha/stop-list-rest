'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuItemsQueryOptions, type MenuFilters } from '../model/queries';
import { useStopItem } from '../model/use-stop-item';
import { useResumeItem } from '../model/use-resume-item';
import type { StopItemPayload } from '@/types/menu';
import { StopListTable } from './StopListTable';
import { StopReasonPanel } from './StopReasonPanel';
import { Toast } from '@/shared/Toast';

type Props = {
  filters: MenuFilters;
};

export function StopListScreen({ filters }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery(
    menuItemsQueryOptions(filters)
  );

  const stopMutation = useStopItem();
  const resumeMutation = useResumeItem();

  const [stopTargetId, setStopTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);

  const stopTarget = data?.find((i) => i.id === stopTargetId) ?? null;

  const handleStop = (payload: StopItemPayload) => {
    if (!stopTargetId) return;
    stopMutation.mutate(
      { id: stopTargetId, payload },
      {
        onSuccess: () => {
          setStopTargetId(null);
          setToast({ kind: 'ok', text: 'Поставлено в стоп' });
        },
        onError: (e) => {
          setToast({ kind: 'error', text: e.message });
        },
      }
    );
  };

  const handleResume = (id: string) => {
    resumeMutation.mutate(id, {
      onSuccess: () => setToast({ kind: 'ok', text: 'Снято со стопа' }),
      onError: (e) => setToast({ kind: 'error', text: e.message }),
    });
  };

  return (
    <>
      <StopListTable
        items={data ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        onStopClick={setStopTargetId}
        onResumeClick={handleResume}
      />

      {stopTarget && (
        <StopReasonPanel
          item={stopTarget}
          onCancel={() => setStopTargetId(null)}
          onSubmit={handleStop}
          isPending={stopMutation.isPending}
        />
      )}

      {toast && (
        <Toast
          kind={toast.kind}
          text={toast.text}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
