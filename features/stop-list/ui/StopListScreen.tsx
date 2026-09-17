'use client';

import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { menuItemsQueryOptions, type MenuFilters } from '../model/queries';
import { useStopItem } from '../model/use-stop-item';
import { useResumeItem } from '../model/use-resume-item';
import { useStopListUI } from '../model/ui-store';
import { StopListTable } from './StopListTable';
import { StopReasonPanel } from './StopReasonPanel';
import type { StopItemPayload } from '@/types/menu';
import { Toast } from '@/shared/ui/Toast';
import { useFilters } from '../model/use-filters';
import { Filters } from './Filters';
import { useEffect } from 'react';
import { ToastContainer } from '@/shared/ui/ToastContainer';

type Props = { initialFilters: MenuFilters };

export function StopListScreen({ initialFilters }: Props) {
  const filters = useFilters(initialFilters);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery(
    menuItemsQueryOptions({ shop: filters.shop, status: filters.status })
  );

  const stopMutation = useStopItem();
  const resumeMutation = useResumeItem();

  const stopPanelItemId = useStopListUI((s) => s.stopPanelItemId);
  const openStopPanel = useStopListUI((s) => s.openStopPanel);
  const closeStopPanel = useStopListUI((s) => s.closeStopPanel);

  const toasts = useStopListUI((s) => s.toasts);

  const showToast = useStopListUI((s) => s.showToast);
  const hideToast = useStopListUI((s) => s.hideToast);

  const pendingIds = useStopListUI(
    useShallow((s) => s.pending.map((p) => p.id))
  );

  const stopTarget = data?.find((i) => i.id === stopPanelItemId) ?? null;

  const handleStop = (payload: StopItemPayload) => {
    if (!stopPanelItemId) return;
    stopMutation.mutate(
      { id: stopPanelItemId, payload },
      {
        onSuccess: () => {
          closeStopPanel();
          showToast({ kind: 'ok', text: 'Поставлено в стоп' });
        },
        onError: (e) => {
          showToast({ kind: 'error', text: e.message });
        },
      }
    );
  };

  const handleResume = (id: string) => {
    resumeMutation.mutate(id, {
      onSuccess: () => showToast({ kind: 'ok', text: 'Снято со стопа' }),
      onError: (e) => showToast({ kind: 'error', text: e.message }),
    });
  };

  return (
    <>
      <Filters
        shop={filters.shop}
        status={filters.status}
        onShopChange={filters.setShop}
        onStatusChange={filters.setStatus}
      />
      <StopListTable
        items={data ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        isItemPending={(id) => pendingIds.includes(id)}
        onStopClick={openStopPanel}
        onResumeClick={handleResume}
      />

      {stopTarget && (
        <StopReasonPanel
          item={stopTarget}
          onCancel={closeStopPanel}
          onSubmit={handleStop}
          isPending={pendingIds.includes(stopTarget.id)}
        />
      )}

      {toasts && <ToastContainer toasts={toasts} onClose={hideToast} />}
    </>
  );
}
