import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MenuItem } from '@/types/menu';

import { menuKeys, resumeMenuItem } from './queries';
import { useStopListUI } from './ui-store';

export function useResumeItem() {
  const qc = useQueryClient();
  const markPending = useStopListUI((s) => s.markPending);
  const clearPending = useStopListUI((s) => s.clearPending);

  return useMutation({
    mutationFn: (id: string) => resumeMenuItem(id),

    onMutate: async (id) => {
      markPending({ id, reason: 'resume' });
      await qc.cancelQueries({ queryKey: menuKeys.lists() });
      const prev = qc.getQueriesData<MenuItem[]>({
        queryKey: menuKeys.lists(),
      });

      qc.setQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() }, (items) =>
        items?.map((item) =>
          item.id === id
            ? {
                ...item,
                status: { kind: 'available' },
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data));
    },

    onSettled: (_data, _err, id) => {
      clearPending({ id, reason: 'resume' });
      qc.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}
