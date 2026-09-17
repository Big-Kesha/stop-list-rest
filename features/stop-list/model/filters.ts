import { MenuItemStatus, Shop } from '@/types/menu';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

// features/stop-list/model/filters.ts
export function useFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const filters = {
    shop: params.get('shop') as Shop | null,
    status: params.get('status') as string | null, // TODO, нужен ли тут отдельный тип
  };

  const set = (next: Partial<typeof filters>) => {
    const sp = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    router.replace(`/?${sp}`); // replace, чтобы не засорять историю
    // про роутер тоже бы разобраться
  };

  return { ...filters, set };
}
