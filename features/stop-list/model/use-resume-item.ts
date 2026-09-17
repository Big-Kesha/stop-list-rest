import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuKeys, resumeMenuItem } from './queries';
import type { MenuItem } from '@/types/menu';

export function useResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeMenuItem(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.lists() });

      const prev = queryClient.getQueriesData<MenuItem[]>({
        queryKey: menuKeys.lists(),
      });

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: menuKeys.lists() },
        (items) =>
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
      ctx?.prev.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}
