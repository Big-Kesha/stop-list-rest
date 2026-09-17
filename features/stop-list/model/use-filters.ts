'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  filtersToQuery,
  isSameFilters,
  parseFilters,
  type MenuFilters,
} from './filters';

export function useFilters(fallback: MenuFilters): MenuFilters & {
  setShop: (shop: MenuFilters['shop']) => void;
  setStatus: (status: MenuFilters['status']) => void;
  reset: () => void;
} {
  const searchParams = useSearchParams();
  const raw = {
    shop: searchParams.get('shop') ?? undefined,
    status: searchParams.get('status') ?? undefined,
  };
  const router = useRouter();
  const pathname = usePathname();

  const filters =
    raw.shop === undefined && raw.status === undefined
      ? fallback
      : parseFilters(raw);

  const apply = useCallback(
    (patch: Partial<MenuFilters>) => {
      const next: MenuFilters = { ...filters, ...patch };
      if (isSameFilters(next, filters)) return;

      const query = filtersToQuery(next);
      const url = query ? `${pathname}?${query}` : pathname;

      router.replace(url, { scroll: false });
    },
    [filters, pathname, router]
  );

  return {
    ...filters,
    setShop: (shop) => apply({ shop }),
    setStatus: (status) => apply({ status }),
    reset: () => apply({ shop: 'all', status: 'all' }),
  };
}
