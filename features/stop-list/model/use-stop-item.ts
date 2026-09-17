import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuKeys, stopMenuItem } from './queries';
import { useStopListUI } from './ui-store';
import type { MenuItem, StopItemPayload } from '@/types/menu';

type StopVars = { id: string; payload: StopItemPayload };

export function useStopItem() {
  const qc = useQueryClient();
  const markPending = useStopListUI((s) => s.markPending);
  const clearPending = useStopListUI((s) => s.clearPending);

  return useMutation({
    mutationFn: (vars: StopVars) => stopMenuItem(vars.id, vars.payload),

    onMutate: async ({ id, payload }) => {
      markPending({ id, reason: 'stop' });

      await qc.cancelQueries({ queryKey: menuKeys.lists() });
      const prev = qc.getQueriesData<MenuItem[]>({
        queryKey: menuKeys.lists(),
      });

      qc.setQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() }, (items) =>
        items?.map((item) =>
          item.id === id
            ? {
                ...item,
                status: {
                  kind: 'stopped',
                  reason: payload.reason,
                  until: payload.until,
                },
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data));
    },

    onSettled: (_data, _err, vars) => {
      clearPending({ id: vars.id, reason: 'stop' });
      qc.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}
