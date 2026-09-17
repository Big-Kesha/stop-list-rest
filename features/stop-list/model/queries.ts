import { queryOptions } from '@tanstack/react-query';
import type { MenuItem, StopItemPayload } from '@/types/menu';

export type MenuFilters = {
  shop: 'all' | 'kitchen' | 'bar' | 'pastry';
  status: 'all' | 'available' | 'stopped';
};

export const menuKeys = {
  all: ['menu-items'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  list: (filters: MenuFilters) => [...menuKeys.lists(), filters] as const,
};

async function fetchMenuItems(filters: MenuFilters): Promise<MenuItem[]> {
  const res = await fetch('/api/menu-items');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Не удалось загрузить меню (${res.status})`);
  }
  const all: MenuItem[] = await res.json();

  return all.filter((item) => {
    if (filters.shop !== 'all' && item.shop !== filters.shop) return false;
    if (filters.status !== 'all' && item.status.kind !== filters.status)
      return false;
    return true;
  });
}

export async function stopMenuItem(
  id: string,
  payload: StopItemPayload
): Promise<MenuItem> {
  const res = await fetch(`/api/menu-items/${id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error ?? `Не удалось поставить в стоп (${res.status})`
    );
  }
  return res.json();
}

export async function resumeMenuItem(id: string): Promise<MenuItem> {
  const res = await fetch(`/api/menu-items/${id}/resume`, { method: 'POST' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Не удалось снять со стопа (${res.status})`);
  }
  return res.json();
}

export const menuItemsQueryOptions = (filters: MenuFilters) =>
  queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
  });
